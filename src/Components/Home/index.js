import './index.css'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {
  FaDollarSign,
  FaCreditCard,
  FaLink,
  FaHourglassHalf,
  FaPercent,
  FaUsers,
  FaMoneyBillTransfer,
  FaRegCopyright,
} from 'react-icons/fa6'
import {useState, useEffect} from 'react'

const status = {
  loading: 'loading',
  success: 'success',
  failure: 'failure',
}

const Home = () => {
  const token = Cookies.get('token')
  const navigate = useNavigate()

  const [metrics, setMetrics] = useState([])
  const [service, setService] = useState('')
  const [yourReferrals, setYourReferrals] = useState('')
  const [activeReferrals, setActiveReferrals] = useState('')
  const [totalRefEarnings, setTotalRefEarnings] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState([])
  const [pageStatus, setPageStatus] = useState(status.loading)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const getReferralData = async () => {
      try {
        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?search=${search}&sort=${sort}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = await response.json()

        if (response.ok) {
          setMetrics(data?.data?.metrics || [])
          setService(data?.data?.serviceSummary?.service || '')
          setYourReferrals(data?.data?.serviceSummary?.yourReferrals || '')
          setActiveReferrals(data?.data?.serviceSummary?.activeReferrals || '')
          setTotalRefEarnings(
            data?.data?.serviceSummary?.totalRefEarnings || '',
          )
          setReferralLink(data?.data?.referral?.link || '')
          setReferralCode(data?.data?.referral?.code || '')
          setReferrals(data?.data?.referrals || [])
          setPageStatus(status.success)
        } else {
          setPageStatus(status.failure)
        }
      } catch (error) {
        console.log(error)
        setPageStatus(status.failure)
      }
    }

    getReferralData()
  }, [token, search, sort])

  const logout = () => {
    Cookies.remove('token')
    navigate('/login')
  }

  const updateSearch = (event) => {
    if (event.key === 'Enter') {
        setSearch(event.target.value)
    }
  }

  const renderHeader = () => (
    <div className="home-page-overview-container">
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

      <h1 className="home-page-sub-heading">Referral Dashboard</h1>
      <p className="home-page-sub-paragraph">
        Track your referrals, earnings and partner activity in one place.
      </p>
    </div>
  )

  const icons = [
  <FaDollarSign />,
  <FaCreditCard />,
  <FaLink />,
  <FaHourglassHalf />,
  <FaPercent />,
  <FaDollarSign />,
  <FaUsers />,
  <FaMoneyBillTransfer />,
]

  const presentFeferrals = referrals.slice(index, index+10)
  const renderBody = () => (
    <>
      <div className="home-page-overview-container">
        <h3 className="home-page-overview-heading">Overview</h3>

        <ul className="home-page-overview-container">
            {metrics.map((eachMetric, index) => (
            <li key={eachMetric.id} className="home-page-overview">
                <div className="overview-image">{icons[index]}</div>
                <h3>{eachMetric.value}</h3>
                <p className="overview-paragraph">{eachMetric.label}</p>
            </li>
        ))}
        </ul>
      </div>

      <br />
      <br />


      <div className="home-page-overview-container">
        <h3 className="home-page-overview-heading">Service Summary</h3>

        <div className="home-page-overview">
          <h3>SUMMARY</h3>
          <p className="overview-paragraph">{service}</p>
        </div>

        <div className="home-page-overview">
          <h3>YOUR REFERRALS</h3>
          <p className="overview-paragraph">{yourReferrals}</p>
        </div>

        <div className="home-page-overview">
          <h3>ACTIVE REFERRALS</h3>
          <p className="overview-paragraph">{activeReferrals}</p>
        </div>

        <div className="home-page-overview">
          <h3>TOTAL REF EARNINGS</h3>
          <p className="overview-paragraph">{totalRefEarnings}</p>
        </div>
      </div>

      <br />
      <br />

      <div className="home-page-overview-container">
        <h3 className="home-page-overview-heading">
          Refer friends and earn money
        </h3>

        <div>
          <p>YOUR REFERRAL LINK</p>
          <div className="home-page-refer-container">
            <p className="refer-link">{referralLink}</p>
            <button type="button" className="home-page-dummy-button">
              Copy
            </button>
          </div>
        </div>

        <div>
          <p>YOUR REFERRAL CODE</p>
          <div className="home-page-refer-container">
            <p className="refer-link">{referralCode}</p>
            <button type="button" className="home-page-dummy-button">
              Copy
            </button>
          </div>
        </div>
      </div>

      <br />
      <br />

      
      <div className="home-page-overview-container">
        <h3 className="home-page-overview-heading">All Referrals</h3>

        <div className="home-page-filter-container">
          <div>
            <label htmlFor="searchInput">Search</label>
            <input
              id="searchInput"
              type="search"
              placeholder="Name or service..."
              onKeyDown={updateSearch}
            />
          </div>

          <div>
            <label htmlFor="dateInput">Sort by date</label>
            <select id="dateInput" onChange={event => setSort(event.target.value)}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="referrals-container coloured-referral">
          <p>NAME</p>
          <p>SERVICE</p>
          <p>DATE</p>
          <p>PROFIT</p>
        </div>

        <ul>
          {presentFeferrals.map(eachReferral => (
            <li key={eachReferral.id}>
              <Link
  to={`/referral/${eachReferral.id}`}
  className={`referrals-container ${
    eachReferral.id % 2 === 1 ? 'coloured-referral' : ''
  }`}
>
  <p>{eachReferral.name}</p>
  <p>{eachReferral.serviceName}</p>
  <p>{eachReferral.date?.replaceAll('-', '/')}</p>
  <p>{eachReferral.profit}</p>
</Link>
            </li>
          ))}
        </ul>

        <div className="pagination-container">
  <p className="entries-text">
    Showing {index + 1} - {Math.min(index + 10, referrals.length)} of{' '}
    {referrals.length} entries
  </p>

  <div className="pagination-buttons">
    <button
      type="button"
      className={index === 0 ? 'disabled-page-btn' : 'page-btn'}
      disabled={index === 0}
      onClick={() => setIndex(index - 10)}
    >
      Previous
    </button>

    {[...Array(Math.ceil(referrals.length / 10))].map((each, pageIndex) => (
      <button
        key={pageIndex}
        type="button"
        className={
          index / 10 === pageIndex ? 'active-page-btn' : 'page-btn'
        }
        onClick={() => setIndex(pageIndex * 10)}
      >
        {pageIndex + 1}
      </button>
    ))}

    <button
      type="button"
      className={
        index + 10 >= referrals.length ? 'disabled-page-btn' : 'page-btn'
      }
      disabled={index + 10 >= referrals.length}
      onClick={() => setIndex(index + 10)}
    >
      Next
    </button>
  </div>
</div>
      </div>
    </>
  )

  const renderFooter = () => (
    <div className="footer-container">
        <h1 className="brand-title">Go Business</h1>
        <nav className="footer-nav">
            <p>About</p>
            <p>Contact</p>
            <p>Privacy</p>
            <p>Terms</p>
        </nav>
        <div className="footer-nav">
            <FaRegCopyright />
            <p>2024 Go Business, Inc.</p>
        </div>
    </div>
  )

  const renderContent = () => {
    switch (pageStatus) {
      case status.loading:
        return <p>Loading dashboard...</p>

      case status.failure:
        return <p>Something went wrong. Please try again.</p>

      case status.success:
        return renderBody()

      default:
        return null
    }
  }

  return (
    <div className="home-page-main-container">
      {renderHeader()}
      <br />
      <br />
      {renderContent()}
      <br />
      <br />
      {renderFooter()}
    </div>
  )
}

export default Home
