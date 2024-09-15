import { useEffect, useState } from "react"
import Form from "../PagesContainer/SearchContainer/Form/Form"
import Listing from "../PagesContainer/SearchContainer/ListingResults/Listing"
import { useNavigate, useLocation } from "react-router-dom"

function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchterm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc'
  })
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  function onInput(value) {
    setSidebardata((pre) => ({ ...pre, ...value }))
  }

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    Object.keys(sidebardata).forEach(key => {
      urlParams.set(key, sidebardata[key]);
    })

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
    console.log("clicked")
  }

  async function onShowMoreClick(){
    const noOflisting = listing.length;
    const startIndex = noOflisting;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/list/searchListing?${searchQuery}`);
    const data = await res.json();
    if(data.length < 9){
      setShowMore(false);
    }
    setListing([...listing, ...data])
  } 


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const sidebarDefaults = {
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'created_at',
      order: 'desc',
    };

    setSidebardata({
      searchTerm: urlParams.get('searchTerm') || sidebarDefaults.searchTerm,
      type: urlParams.get('type') || sidebarDefaults.type,
      parking: urlParams.get('parking') === 'true',
      furnished: urlParams.get('furnished') === 'true',
      offer: urlParams.get('offer') === 'true',
      sort: urlParams.get('sort') || sidebarDefaults.sort,
      order: urlParams.get('order') || sidebarDefaults.order,
    });

    async function fetchListing() {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/list/searchListing?${searchQuery}`);
        const data = await res.json();
        setListing(data)
        if(data.length > 8){
          setShowMore(true)
        }
      } catch (error) {
        console.log(error.message) //later clear log
      } finally {
        setLoading(false)
      }
    }

    fetchListing();
    
  }, [location.search])



  return (
    <div className="flex flex-col md:flex-row">
      <Form onInput={onInput} data={sidebardata} onSubmit={handleSubmit} />
      <Listing loading={loading} listing={listing} onShowMoreClick={onShowMoreClick} showMore={showMore}/>
    </div>
  )
}

export default Search
