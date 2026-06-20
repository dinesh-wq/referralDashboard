import './index.css'
import {useState, useEffect} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const ReferralDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const token = Cookies.get('token')

  const [referralData, setReferralData] = useState(null)
  const [status, setStatus] = useState(apiStatus.loading)

  useEffect(() => {
    const getReferralDetails = async () => {
      try {
        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = await response.json()

        if (response.ok) {
          if (data.data?.id?.toString() === id) {
            setReferralData(data.data)
          } else {
            const foundReferral = data.data?.referrals?.find(
              each => each.id.toString() === id,
            )
            setReferralData(foundReferral || null)
          }
          setStatus(apiStatus.success)
        } else {
          setStatus(apiStatus.failure)
        }
      } catch (error) {
        setStatus(apiStatus.failure)
      }
    }

    getReferralDetails()
  }, [id, token])

  const logout = () => {
    Cookies.remove('token')
    navigate('/login')
  }

  const formatDate = date =>
    date ? date.replaceAll('-', '/') : ''

  const formatProfit = amount =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)

  const renderSuccessView = () => {
    if (!referralData) {
      return <h1>Referral not found</h1>
    }

    return (
      <>
        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>

        <h1 className="details-heading">Referral Details</h1>
        <p className="details-description">
          Full information for this referral partner.
        </p>

        <div className="details-card">
          <div className="card-top-section">
            <h2>{referralData.name}</h2>
            <p className="service-badge">{referralData.serviceName}</p>
          </div>

          <div className="details-row">
            <p>REFERRAL ID</p>
            <p>{referralData.id}</p>
          </div>

          <div className="details-row">
            <p>NAME</p>
            <p>{referralData.name}</p>
          </div>

          <div className="details-row">
            <p>SERVICE NAME</p>
            <p>{referralData.serviceName}</p>
          </div>

          <div className="details-row">
            <p>DATE</p>
            <p>{formatDate(referralData.date)}</p>
          </div>

          <div className="details-row">
            <p>PROFIT</p>
            <p>{formatProfit(referralData.profit)}</p>
          </div>
        </div>
      </>
    )
  }

  const renderContent = () => {
    switch (status) {
      case apiStatus.loading:
        return <p>Loading details...</p>

      case apiStatus.failure:
        return <p>Something went wrong</p>

      case apiStatus.success:
        return renderSuccessView()

      default:
        return null
    }
  }

  return (
    <div className="details-page-container">
      <nav className="home-page-nav-bar">
        <h1 className="brand-title">Go Business</h1>
        <div className="nav-bar-buttons">
          <button type="button" className="home-page-dummy-button">
            Try for Free
          </button>
          <button
            type="button"
            className="home-page-logout-button"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="details-content">{renderContent()}</div>
    </div>
  )
}

export default ReferralDetails