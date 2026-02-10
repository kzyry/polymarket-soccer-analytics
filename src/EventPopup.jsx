import { useEffect, useState } from 'react'

function EventPopup({ event, onClose, priceHistoryData }) {
  const [mergedPrices, setMergedPrices] = useState([])

  useEffect(() => {
    if (!priceHistoryData) return

    const eventData = priceHistoryData[event.id]
    if (!eventData) return

    // New optimized format: { n: [team1, draw, team2], p: [[time, y1, n1, yd, nd, y2, n2], ...] }
    const prices = eventData.p || []

    // Build merged table data
    const merged = prices.map(row => ({
      time: row[0],
      team1Yes: row[1] !== null ? row[1].toFixed(3) : '—',
      team1No: row[2] !== null ? row[2].toFixed(3) : '—',
      drawYes: row[3] !== null ? row[3].toFixed(3) : '—',
      drawNo: row[4] !== null ? row[4].toFixed(3) : '—',
      team2Yes: row[5] !== null ? row[5].toFixed(3) : '—',
      team2No: row[6] !== null ? row[6].toFixed(3) : '—',
    }))

    setMergedPrices(merged)
  }, [event.id, priceHistoryData])

  const eventData = priceHistoryData?.[event.id]
  const teamNames = eventData?.n
    ? { team1: eventData.n[0], draw: eventData.n[1], team2: eventData.n[2] }
    : { team1: 'Team 1', draw: 'Draw', team2: 'Team 2' }

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-primary-light rounded-lg border border-primary-lighter w-[720px] h-[640px] flex flex-col">
        {/* Header */}
        <div className="border-b border-primary-lighter p-4">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-bold text-white pr-8">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-400">Outcome:</span>{' '}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                {event.outcome}
              </span>
            </div>
            <div className="text-gray-400">
              Tournament: <span className="text-white">{event.series || 'Other'}</span>
            </div>
            <div className="text-gray-400">
              Volume: <span className="text-white font-mono">${event.volume.toLocaleString()}</span>
            </div>
            {event.polymarket_url && (
              <a
                href={event.polymarket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent hover:text-accent-hover transition-colors text-xs"
              >
                View on Polymarket
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Price History Table */}
        <div className="flex-1 overflow-auto">
          {!eventData ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No price history available for this event
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-primary-light border-b border-primary-lighter">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold" rowSpan="2">
                    Time
                  </th>
                  <th className="text-center px-3 py-2 text-gray-400 font-semibold border-l border-primary-lighter" colSpan="2">
                    {teamNames.team1}
                  </th>
                  <th className="text-center px-3 py-2 text-gray-400 font-semibold border-l border-primary-lighter" colSpan="2">
                    {teamNames.draw}
                  </th>
                  <th className="text-center px-3 py-2 text-gray-400 font-semibold border-l border-primary-lighter" colSpan="2">
                    {teamNames.team2}
                  </th>
                </tr>
                <tr>
                  <th className="text-center px-3 py-1.5 text-gray-500 font-medium text-[10px] border-l border-t border-primary-lighter">Yes</th>
                  <th className="text-center px-3 py-1.5 text-gray-500 font-medium text-[10px] border-t border-primary-lighter">No</th>
                  <th className="text-center px-3 py-1.5 text-gray-500 font-medium text-[10px] border-l border-t border-primary-lighter">Yes</th>
                  <th className="text-center px-3 py-1.5 text-gray-500 font-medium text-[10px] border-t border-primary-lighter">No</th>
                  <th className="text-center px-3 py-1.5 text-gray-500 font-medium text-[10px] border-l border-t border-primary-lighter">Yes</th>
                  <th className="text-center px-3 py-1.5 text-gray-500 font-medium text-[10px] border-t border-primary-lighter">No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-lighter/50">
                {mergedPrices.map((row, idx) => (
                  <tr key={idx} className="hover:bg-primary-lighter/30 transition-colors">
                    <td className="px-3 py-1.5 text-white font-mono">{row.time}</td>
                    <td className="px-3 py-1.5 text-center text-gray-300 font-mono border-l border-primary-lighter/50">{row.team1Yes}</td>
                    <td className="px-3 py-1.5 text-center text-gray-300 font-mono">{row.team1No}</td>
                    <td className="px-3 py-1.5 text-center text-gray-300 font-mono border-l border-primary-lighter/50">{row.drawYes}</td>
                    <td className="px-3 py-1.5 text-center text-gray-300 font-mono">{row.drawNo}</td>
                    <td className="px-3 py-1.5 text-center text-gray-300 font-mono border-l border-primary-lighter/50">{row.team2Yes}</td>
                    <td className="px-3 py-1.5 text-center text-gray-300 font-mono">{row.team2No}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventPopup
