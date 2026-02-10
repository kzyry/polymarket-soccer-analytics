import { useState, useEffect, useMemo } from 'react'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTournament, setSelectedTournament] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 500

  // Load events data
  useEffect(() => {
    fetch('/polymarket-soccer-analytics/events.json')
      .then(response => response.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading events:', error)
        setLoading(false)
      })
  }, [])

  // Get unique tournaments
  const tournaments = useMemo(() => {
    const unique = [...new Set(events.map(e => e.series).filter(Boolean))]
    return unique.sort()
  }, [events])

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events

    // Filter by tournament
    if (selectedTournament !== 'all') {
      filtered = filtered.filter(e => e.series === selectedTournament)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.outcome.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [events, selectedTournament, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage)
  }, [filteredEvents, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTournament])

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <header className="border-b border-primary-lighter">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold mb-1.5">Polymarket Soccer Analytics</h1>
          <p className="text-gray-400 text-sm">
            {filteredEvents.length.toLocaleString()} events •
            ${filteredEvents.reduce((sum, e) => sum + e.volume, 0).toLocaleString()} total volume
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events or outcomes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-primary-light border border-primary-lighter rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-500"
            />
          </div>

          {/* Tournament filter */}
          <div className="md:w-64">
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-primary-light border border-primary-lighter rounded-lg focus:outline-none focus:border-accent text-white"
            >
              <option value="all">All Tournaments</option>
              {tournaments.map(tournament => (
                <option key={tournament} value={tournament}>
                  {tournament}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-[1400px] mx-auto px-6 pb-6">
        <div className="bg-primary-light rounded-lg border border-primary-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-lighter">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-lighter text-sm">
                {paginatedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-primary-lighter/50 transition-colors h-[36px]">
                    <td className="px-6 py-2">
                      <div className="text-white font-medium">{event.title}</div>
                    </td>
                    <td className="px-6 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                        {event.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-2 text-gray-400">
                      {event.series || 'Other'}
                    </td>
                    <td className="px-6 py-2 text-right font-mono">
                      ${event.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 text-center">
                      {event.polymarket_url && (
                        <a
                          href={event.polymarket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-accent hover:text-accent-hover transition-colors text-xs"
                        >
                          View
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-primary-lighter px-6 py-3 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Page {currentPage} of {totalPages} •
                Showing {((currentPage - 1) * eventsPerPage) + 1}-{Math.min(currentPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length.toLocaleString()} events
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm bg-primary-lighter rounded-lg hover:bg-primary-lighter/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm bg-primary-lighter rounded-lg hover:bg-primary-lighter/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-6 py-8 text-center text-gray-500 text-sm">
        <p>Data from Polymarket API • Updated 2025</p>
      </footer>
    </div>
  )
}

export default App
