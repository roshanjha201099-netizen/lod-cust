import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useData } from '../context/DataWrapper'

type PostRequirementPageProps = {
  onBackHome: () => void
}

export function PostRequirementPage({ onBackHome }: PostRequirementPageProps) {
  const { currentUser, requirements, addRequirement, signOut } = useData()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange =
    (setter: (file: File | null) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.files?.[0] ?? null)
      setError('')
      setSuccess('')
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!audioFile && !videoFile) {
      setError('Please upload at least one audio or video file.')
      setSuccess('')
      return
    }

    addRequirement({
      title,
      description,
      imageName: imageFile?.name,
      audioName: audioFile?.name,
      videoName: videoFile?.name,
    })

    setTitle('')
    setDescription('')
    setImageFile(null)
    setAudioFile(null)
    setVideoFile(null)
    setError('')
    setSuccess('Requirement posted successfully.')
    event.currentTarget.reset()
  }

  return (
    <main className="auth-page">
      <section className="requirement-layout">
        <aside className="auth-aside">
          <div className="dashboard-topline">
            <a className="brand" href="/">
              LOD
            </a>
            <button className="button button-ghost button-inline" onClick={onBackHome} type="button">
              Home
            </button>
          </div>

          <p className="eyebrow">Post Requirement</p>
          <h1>Tell providers what you need</h1>
          <p className="auth-lead">
            Share a title, short description, and supporting media so nearby
            providers can understand the work clearly.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit-card">
              <strong>{currentUser?.fullName || currentUser?.email}</strong>
              <span>Logged in and ready to post service requirements.</span>
            </div>
            <div className="auth-benefit-card">
              <strong>Media rule</strong>
              <span>Audio or video is compulsory. Image is optional.</span>
            </div>
            <div className="auth-benefit-card">
              <strong>Clearer requests</strong>
              <span>Better details help providers respond faster.</span>
            </div>
          </div>
        </aside>

        <section className="auth-card">
          <div className="auth-card-head">
            <div className="dashboard-topline">
              <div>
                <p className="section-tag">Requirement Form</p>
                <h2>Post your requirement</h2>
              </div>
              <button
                className="button button-ghost button-inline"
                onClick={() => {
                  signOut()
                  window.location.href = '/?view=signin'
                }}
                type="button"
              >
                Log Out
              </button>
            </div>
            <p>Title and description are required. Add image if useful. Audio or video is mandatory.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Requirement Title</span>
              <input
                required
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Need AC repair at home"
              />
            </label>

            <label className="form-field">
              <span>Description</span>
              <textarea
                required
                className="form-textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain the problem, timing, address details, and any urgent notes."
              />
            </label>

            <label className="form-field">
              <span>Image (optional)</span>
              <input type="file" accept="image/*" onChange={handleFileChange(setImageFile)} />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span>Audio (required if no video)</span>
                <input type="file" accept="audio/*" onChange={handleFileChange(setAudioFile)} />
              </label>

              <label className="form-field">
                <span>Video (required if no audio)</span>
                <input type="file" accept="video/*" onChange={handleFileChange(setVideoFile)} />
              </label>
            </div>

            {error ? <p className="form-message error-message">{error}</p> : null}
            {success ? <p className="form-message success-message">{success}</p> : null}

            <button className="button button-primary auth-submit" type="submit">
              Post Requirement
            </button>
          </form>

          <div className="requirements-feed">
            <div className="requirements-feed-head">
              <h3>Recent Posts</h3>
              <span>{requirements.length} total</span>
            </div>

            {requirements.length === 0 ? (
              <p className="empty-state">No requirements posted yet.</p>
            ) : (
              <div className="requirements-list">
                {requirements.map((requirement) => (
                  <article key={requirement.id} className="requirement-card">
                    <div className="requirement-card-head">
                      <strong>{requirement.title}</strong>
                      <span>
                        {new Date(requirement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{requirement.description}</p>
                    <div className="requirement-tags">
                      {requirement.imageName ? (
                        <span className="media-tag">Image: {requirement.imageName}</span>
                      ) : null}
                      {requirement.audioName ? (
                        <span className="media-tag">Audio: {requirement.audioName}</span>
                      ) : null}
                      {requirement.videoName ? (
                        <span className="media-tag">Video: {requirement.videoName}</span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
