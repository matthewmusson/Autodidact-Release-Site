import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

const GITHUB_REPO = 'matthewmusson/Autodidact-Releases'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [latestRelease, setLatestRelease] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  useEffect(() => {
    fetchLatestRelease()
  }, [])

  const fetchLatestRelease = async () => {
    try {
      // Fetch all releases (including pre-releases) and get the most recent one
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`)

      if (!response.ok) {
        throw new Error('Failed to fetch release')
      }

      const data = await response.json()

      // Get the first release (most recent)
      if (data && data.length > 0) {
        setLatestRelease(data[0])
      } else {
        setError('No releases found')
      }

      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const getDmgAsset = () => {
    if (!latestRelease?.assets) return null
    return latestRelease.assets.find(asset => asset.name.endsWith('.dmg'))
  }

  const getZipAsset = () => {
    if (!latestRelease?.assets) return null
    return latestRelease.assets.find(asset => asset.name.endsWith('.zip'))
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    const mb = (bytes / (1024 * 1024)).toFixed(1)
    return `${mb} MB`
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const dmgAsset = getDmgAsset()
  const zipAsset = getZipAsset()

  return (
    <div className="app">
      <button
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="container">
        <header className="header">
          <img
            src="/logos/AutodidactAppLogo.png"
            alt="Autodidact Logo"
            className="logo"
          />
          <h1 className="title">Download Autodidact</h1>
          <p className="subtitle">Your AI-powered learning companion</p>
        </header>

        <main className="main">
          {loading && (
            <div className="status-message">
              <p>Loading latest release...</p>
            </div>
          )}

          {error && (
            <div className="status-message error">
              <p>Unable to load release information.</p>
              <p className="error-detail">{error}</p>
            </div>
          )}

          {!loading && !error && latestRelease && (
            <div className="release-card">
              <div className="release-header">
                <h2 className="version-tag">{latestRelease.tag_name}</h2>
                {latestRelease.prerelease && (
                  <span className="beta-badge">Beta</span>
                )}
              </div>

              <p className="release-date">
                Released {formatDate(latestRelease.published_at)}
              </p>

              <div className="download-section">
                <h3 className="download-title">Download for macOS</h3>

                <div className="download-buttons">
                  {dmgAsset && (
                    <a
                      href={dmgAsset.browser_download_url}
                      className="download-button primary"
                      download
                    >
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <div className="button-content">
                        <span className="button-label">Download DMG</span>
                        <span className="button-size">{formatFileSize(dmgAsset.size)}</span>
                      </div>
                    </a>
                  )}

                  {zipAsset && (
                    <a
                      href={zipAsset.browser_download_url}
                      className="download-button secondary"
                      download
                    >
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <div className="button-content">
                        <span className="button-label">Download ZIP</span>
                        <span className="button-size">{formatFileSize(zipAsset.size)}</span>
                      </div>
                    </a>
                  )}
                </div>

                <div className="requirements">
                  <p className="requirements-title">System Requirements</p>
                  <p className="requirements-text">macOS (Apple Silicon & Intel)</p>
                </div>
              </div>

              {latestRelease.body && (
                <div className="release-notes">
                  <h3 className="notes-title">Release Notes</h3>
                  <div className="notes-content">
                    <ReactMarkdown>{latestRelease.body}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !latestRelease && (
            <div className="status-message">
              <p>No releases available yet.</p>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              View on GitHub →
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
