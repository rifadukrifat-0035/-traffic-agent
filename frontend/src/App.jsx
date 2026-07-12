import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  CloudUpload,
  Download,
  FileText,
  Radar,
  Video,
} from 'lucide-react'
import api from './lib/api'

function App() {
  const [videoFile, setVideoFile] = useState(null)
  const [prompt, setPrompt] = useState('Count only buses')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [statusText, setStatusText] = useState('Awaiting stream input...')
  const [result, setResult] = useState(null)

  const uploadLabel = useMemo(() => {
    if (!videoFile) {
      return 'Drop traffic footage here or click to browse'
    }
    return `${videoFile.name} • ${(videoFile.size / 1024 / 1024).toFixed(2)} MB`
  }, [videoFile])

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) {
      setVideoFile(dropped)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setStatusText('Syncing with backend intelligence...')

    try {
      const { data } = await api.get('/')
      setStatusText(data?.status || 'Backend connected. Ready for processing.')

      setTimeout(() => {
        setResult({
          classes: ['Bus'],
          confidence: 0.94,
          totalVehicles: 118,
        })
        setIsAnalyzing(false)
      }, 1200)
    } catch (error) {
      setStatusText('Backend unreachable. Ensure API is running at localhost:8000.')
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="dark relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[length:32px_32px] opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-24 top-14 h-72 w-72 rounded-full bg-cyber/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-neon/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8">
        <header className="glass-panel neon-border mb-8 flex items-center justify-between rounded-2xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyber/20 p-2 shadow-cyber">
              <Radar className="h-5 w-5 text-cyber" />
            </div>
            <div>
              <p className="font-display text-lg tracking-[0.22em] text-cyber">Traffic AI Agent Pro</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Automated Traffic Volume Survey</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-slate-300 md:flex">
            <Activity className="h-4 w-4 text-neon" />
            Real-time stream intelligence
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-slate-300">
              <CloudUpload className="h-4 w-4 text-cyber" />
              Stream Input
            </div>

            <label
              className={`relative mb-5 block cursor-pointer rounded-2xl border border-dashed p-7 text-center transition duration-300 ${
                isDragging
                  ? 'border-cyber bg-cyber/10 shadow-cyber'
                  : 'border-white/20 bg-white/5 hover:border-cyber/60 hover:bg-white/10'
              }`}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
              />
              <Video className="mx-auto mb-3 h-10 w-10 text-cyber" />
              <p className="font-medium text-slate-100">{uploadLabel}</p>
              <p className="mt-2 text-xs text-slate-400">Supported: MP4, AVI, MOV</p>
            </label>

            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">NLP Prompt</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="glass-input resize-none"
                placeholder="Count only buses"
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber/85 to-neon/85 px-4 py-3 font-semibold text-slate-900 transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Bot className="h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Stream'}
              </button>
            </div>
          </section>

          <section className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-slate-300">
              <Activity className="h-4 w-4 text-neon" />
              Processing & Reports
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pipeline Status</p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isAnalyzing ? 'animate-pulse bg-cyber shadow-cyber' : 'bg-neon shadow-neon'
                  }`}
                />
                <p className="text-sm text-slate-200">{statusText}</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-slate-400">Target Class</p>
                  <p className="mt-1 font-semibold text-cyber">{result?.classes?.join(', ') || 'Pending'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-slate-400">Confidence</p>
                  <p className="mt-1 font-semibold text-neon">{result ? `${Math.round(result.confidence * 100)}%` : '--'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-slate-400">Vehicle Count</p>
                  <p className="mt-1 font-semibold text-slate-100">{result?.totalVehicles ?? '--'}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="https://glowing-space-barnacle-jjw7r57rg9r62ww-8000.app.github.dev/download/report"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyber/60 bg-cyber/10 px-4 py-3 text-sm font-semibold text-cyber transition hover:bg-cyber/20"
              >
                <FileText className="h-4 w-4" />
                Download PDF
              </a>
              <a
                href="https://glowing-space-barnacle-jjw7r57rg9r62ww-8000.app.github.dev/download/csv"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neon/60 bg-neon/10 px-4 py-3 text-sm font-semibold text-neon transition hover:bg-neon/20"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App