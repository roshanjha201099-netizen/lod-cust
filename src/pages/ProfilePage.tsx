import { useData } from '../context/DataWrapper'
import { ROUTES, navigate } from '../lib/router'
import { AppLink } from '../components/AppLink'

export function ProfilePage() {
  const { currentUser, wallet, requirements, signOut } = useData()

  return (
    <main className="auth-page">
      <section className="requirement-layout">
        <aside className="auth-aside">
          <div className="dashboard-topline">
            <AppLink className="brand" to={ROUTES.home}>
              LOD
            </AppLink>
            <button
              className="button button-ghost button-inline"
              onClick={() => navigate(ROUTES.home)}
              type="button"
            >
              Home
            </button>
          </div>

          <p className="eyebrow">User Profile</p>
          <h1>{currentUser?.fullName || 'LOD User'}</h1>
          <p className="auth-lead">
            View your account details, wallet credits, and recent LOD activity in
            one place.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit-card">
              <strong>{wallet.balance} Credits</strong>
              <span>Available now in your wallet.</span>
            </div>
            <div className="auth-benefit-card">
              <strong>{requirements.length} Requirements</strong>
              <span>Total service requests posted from this account.</span>
            </div>
            <div className="auth-benefit-card">
              <strong>{currentUser?.mobile || 'No mobile saved'}</strong>
              <span>Primary mobile number for your account.</span>
            </div>
          </div>
        </aside>

        <section className="auth-card">
          <div className="auth-card-head">
            <div className="dashboard-topline">
              <div>
                <p className="section-tag">Account Overview</p>
                <h2>Your profile and wallet</h2>
              </div>
              <button
                className="button button-ghost button-inline"
                onClick={() => {
                  signOut()
                  navigate(ROUTES.signin)
                }}
                type="button"
              >
                Log Out
              </button>
            </div>
            <p>
              Your signup bonus and account information are stored locally for this
              demo experience.
            </p>
          </div>

          <div className="profile-grid">
            <article className="profile-card wallet-card">
              <p className="section-tag">Wallet</p>
              <strong>{wallet.balance}</strong>
              <span>Credits available</span>
            </article>

            <article className="profile-card">
              <p className="section-tag">Contact</p>
              <h3>{currentUser?.email || 'No email saved'}</h3>
              <p>{currentUser?.mobile || 'No mobile saved'}</p>
            </article>
          </div>

          <div className="profile-details">
            <div className="requirements-feed-head">
              <h3>Profile Details</h3>
            </div>
            <div className="detail-list">
              <div className="detail-row">
                <span>Address</span>
                <strong>{currentUser?.streetAddress || 'Not provided'}</strong>
              </div>
              <div className="detail-row">
                <span>Area</span>
                <strong>{currentUser?.area || 'Not provided'}</strong>
              </div>
              <div className="detail-row">
                <span>City</span>
                <strong>{currentUser?.city || 'Not provided'}</strong>
              </div>
              <div className="detail-row">
                <span>State</span>
                <strong>{currentUser?.state || 'Not provided'}</strong>
              </div>
              <div className="detail-row">
                <span>Pincode</span>
                <strong>{currentUser?.pincode || 'Not provided'}</strong>
              </div>
            </div>
          </div>

          <div className="requirements-feed">
            <div className="requirements-feed-head">
              <h3>Wallet History</h3>
              <span>{wallet.transactions.length} entries</span>
            </div>

            <div className="requirements-list">
              {wallet.transactions.map((transaction) => (
                <article key={transaction.id} className="requirement-card">
                  <div className="requirement-card-head">
                    <strong>{transaction.note}</strong>
                    <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="requirement-tags">
                    <span className="media-tag">
                      {transaction.type === 'credit' ? '+' : '-'}
                      {transaction.amount} credits
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
