import React, { useCallback, useEffect, useState } from 'react'
import Map from '../../../components/googleMap'
import calculateDistance from '../../../components/calculateDistace'
import { navigateToGoogleMaps, trimmedTxt } from '../../../util/_common'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import indiaIcon from "../../../../public/assets/icon/indiaIcon.svg"
import Geocode from '../../../components/Geocode'
import axios from 'axios'
import getUrlWithKey from '../../../util/_apiUrl'
import { useRead } from '../../../hooks'
import { setLinkName } from '../../../reducer/linkNameReducer'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import LocationGif from '../../../../public/assets/images/google-maps.gif';

const Storelocator: React.FC<{ latTo: number, lngTo: number, address: any }> = ({ latTo, lngTo, address }) => {

  const dispatch = useDispatch();
  const router = useRouter();

  const [directions, setDirections]: any = useState()
  const [locationId, setLocationId]: any = useState();
  const [dataSet, setDataSet] = useState<any>(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    setLatitude(latTo)
    setLongitude(lngTo)
  }, [latTo, lngTo])

  const { get_store_locator } = getUrlWithKey("client_apis");

  const [payload, setPayload] = useState(null);

  const { sendData, loading, error }: any = useRead({ selectMethod: "put", url: get_store_locator, callData: payload });
  interface Coordinates {
    lat: number;
    lng: number;
  }
  const [coordinates, setCoordinatesState] = useState<Coordinates | null>(null);

  const getLinlName = useSelector((state: any) => state?.linkNameReducer?.value);

  console.log(latitude, longitude, address, "longtitude");

  useEffect(() => {
    dispatch(setLinkName("Stores locator"))
  }, [router.pathname])

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [radius, setRadius] = useState<number>(50);
  const [results, setResults] = useState<number>(25);
  const [searchError, setSearchError] = useState<string>('');


  useEffect(() => {
    const API_KEY = 'AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU';

    // `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&region=IN&key=${API_KEY}`;
    // Add region bias for India
    const geocodeURL = (pincode: any) =>
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&components=country:IN&key=${API_KEY}`;

    // Fetch Latitude and Longitude by Pincode
    async function getLatLong(pincode: any) {
      try {
        const response = await fetch(geocodeURL(pincode));
        const data = await response.json();
        if (data?.status === "OK") {
          const isInIndia = data?.results[0]?.address_components.some((component: any) =>
            component.types.includes("country") && component.short_name === "IN"
          );

          if (isInIndia) {
            setLatitude(data?.results[0]?.geometry?.location?.lat);
            setLongitude(data?.results[0]?.geometry?.location?.lng);
          } else {
            console.error("Location is outside India. Not displaying on map.");
            // Optionally handle this case (e.g., show a message to the user)
          }
          // setLatitude(data?.results[0]?.geometry?.location?.lat);
          // setLongitude(data?.results[0]?.geometry?.location?.lng);
        } else {
          console.error('Geocoding failed:', data?.status, data?.error_message);
        }
      } catch (error) {
        console.error('Error fetching geolocation:', error);
      }
    }

    if (searchTerm) {
      getLatLong(searchTerm);
    }
  }, [searchTerm]);



  console.log(getLinlName, "getLinlName")

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);

    // Allow only numbers and limit to 6 digits
    const numericInput = value.replace(/[^0-9]/g, '');
    // console.log(numericInput);

    if (/^\d{0,6}$/.test(value)) {
      setSearchTerm(value);
      setSearchError('');
    } else {
      setSearchError('ZIP code must be 6 digits long');
    }
    // setSearchTerm(e.target.value);
  };

  const debounce = (func: any, wait: any) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: any) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const fetchPostCodeData = async (searchTerm: any) => {
    try {
      const { data } = await axios.get(
        `https://api.postalpincode.in/pincode/${searchTerm}`
      );
      // console.log(data?.[0], "hghjfjh");

      if (data?.[0]?.Status === "Success" && searchTerm?.length >= 6) {
        console.log(data?.[0])
        setSearchError("")
      }
      else if (data?.[0]?.Status === "Error" && searchTerm?.length >= 6) {
        if (data && data[0] && data[0].PostOffice === null) {
          setSearchError('Invalid Zip Code');
        }

        // console.log(data && data[0], "hghjfjh");
        // setSearchTerm("")
      } else if (data?.[0]?.Status === "Error" && searchTerm?.length < 6) {
        if (data && data[0] && data[0].PostOffice === null) {
          setSearchError('Invalid Zip Code');
        }
      }

    } catch (error) {
      console.error(error);
    }
  };
  // const fetchPostCodeDataDebounced = useCallback(
  //   debounce(fetchPostCodeData, 300),
  //   [searchTerm]
  // );

  // useEffect(() => {
  //   fetchPostCodeDataDebounced();
  // }, [searchTerm, fetchPostCodeDataDebounced]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRadius(Number(e.target.value));
  };

  const handleResultsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResults(Number(e.target.value));
  };

  const handleSearch = async () => {
    if (searchTerm.length !== 6) {
      setSearchError('ZIP code must be exactly 6 digits long');
      return;
    }
    try {
      fetchPostCodeData(searchTerm);
    } catch (error) {
      console.log(error)
    }
    // Add your search logic here
    if (radius && results && searchTerm) {
      const coordinates = await getCoordinates(searchTerm);
      const dataSet = {
        "store_search": true,
        "latitude": coordinates?.geometry?.location?.lat,
        "longitude": coordinates?.geometry?.location?.lng,
        "max_results": results,
        "search_radius": radius
      }
      setPayload(dataSet);
      // setSearchTerm(coordinates?.formatted_address)
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      const dataSet = {
        "store_search": true,
        "latitude": latitude,
        "longitude": longitude,
        "max_results": results,
        "search_radius": radius
      }
      setPayload(dataSet);
    }

    if (address && !searchTerm) {
      setSearchTerm(address);
    }
  }, [latitude, longitude, address]);

  useEffect(() => {
    if (!error && sendData?.length) {
      setDataSet(sendData);
    }
  }, [sendData?.length]);

  interface StoreSearchProps {
    res?: any,
    st?: any
  }

  const renderSearchHtml = () => {
    return (
      <div className="store-card px-0" data-aos="fade-down">
        <div className="card-body">
          <div className="px-0">
            {latitude !== null && longitude !== null && address !== null ? <div className="row">
              <div className="col-md-6 col-lg-3">
                <div className="mb-3">
                  <label htmlFor="" className="col-form-label stor">Type ZIP Code</label>
                  <input
                    type="number"
                    id="inputtxt"
                    className="form-control cont"
                    aria-describedby=""
                    placeholder='Enter ZIP Code'
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                  // onBlur={() => fetchPostCodeDataDebounced()}
                  />
                  {searchError && <p style={{ color: 'red', fontSize: '12px' }}>{searchError}</p>}
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="mb-3">
                  <label htmlFor="" className="col-form-label stor">Search radius (km)</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={radius}
                    onChange={handleRadiusChange}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                  </select>
                </div>
                <div className=""></div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="mb-3">
                  <label htmlFor="" className="col-form-label stor">Results</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={results}
                    onChange={handleResultsChange}
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <button type='button' className='show-btn str' onClick={handleSearch}>Search</button>
              </div>
            </div> : ""}
          </div>
        </div>
      </div>
    );
  }

  // const StoreSearch: React.FC<StoreSearchProps> = ({ res, st }) => {
  //   const [searchTerm, setSearchTerm] = useState<string>(st ? st : '');
  //   const [radius, setRadius] = useState<number>(50);
  //   const [results, setResults] = useState<number>(25);

  //   const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchTerm(e.target.value);
  //   };

  //   const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setRadius(Number(e.target.value));
  //   };

  //   const handleResultsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setResults(Number(e.target.value));
  //   };

  //   const handleSearch = () => {
  //     // Add your search logic here
  //     res({
  //       "search_term": searchTerm,
  //       "radius": radius,
  //       "results": results,
  //     })
  //   };

  //   return (
  //     <div className="store-card px-0">
  //       <div className="card-body">
  //         <div className="px-0">
  //           <div className="row">
  //             <div className="col-md-6 col-lg-3">
  //               <div className="mb-3">
  //                 <label htmlFor="" className="col-form-label stor">Find a Store or Spa</label>
  //                 <input
  //                   type="text"
  //                   id="inputtxt"
  //                   className="form-control cont"
  //                   aria-describedby=""
  //                   placeholder='Find a Store or Spa'
  //                   value={searchTerm}
  //                   onChange={handleSearchTermChange}
  //                 />
  //               </div>
  //             </div>
  //             <div className="col-md-6 col-lg-3">
  //               <div className="mb-3">
  //                 <label htmlFor="" className="col-form-label stor">Search radius</label>
  //                 <select
  //                   className="form-select"
  //                   aria-label="Default select example"
  //                   value={radius}
  //                   onChange={handleRadiusChange}
  //                 >
  //                   <option value="10">10</option>
  //                   <option value="25">25</option>
  //                   <option value="50">50</option>
  //                   <option value="100">100</option>
  //                   <option value="200">200</option>
  //                   <option value="500">500</option>
  //                 </select>
  //               </div>
  //               <div className=""></div>
  //             </div>
  //             <div className="col-md-6 col-lg-3">
  //               <div className="mb-3">
  //                 <label htmlFor="" className="col-form-label stor">Results</label>
  //                 <select
  //                   className="form-select"
  //                   aria-label="Default select example"
  //                   value={results}
  //                   onChange={handleResultsChange}
  //                 >
  //                   <option value="25">25</option>
  //                   <option value="50">50</option>
  //                   <option value="75">75</option>
  //                   <option value="100">100</option>
  //                 </select>
  //               </div>
  //             </div>
  //             <div className="col-md-6 col-lg-3">
  //               <button type='button' className='show-btn str' onClick={handleSearch}>Search</button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const getCoordinates = async (address?: any) => {
    const apiKey = 'AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const location = response.data.results[0];
        return location
        // setCoordinates(location);
        // setError('');
      } else {
        return false;
        // setError('Error fetching coordinates. Please try again.');
      }
    } catch (error) {
      return false;
      // setError('Error fetching coordinates. Please try again.');
    }
  };

  const [searchT, setSearchT] = useState('');

  // const StoreSearchRes = async (data: any) => {
  //   if (data && data?.radius && data?.results && data?.search_term) {
  //     setSearchT(data?.search_term)
  //     const coordinates = await getCoordinates(data?.search_term);
  //     const dataSet = {
  //       "store_search": true,
  //       "latitude": coordinates?.lat,
  //       "longitude": coordinates?.lng,
  //       "max_results": data?.results,
  //       "search_radius": data?.radius
  //     }
  //     resp(dataSet);
  //   }
  // }


  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude)
        },
        (error) => {
          console.log(error.message, '__error');
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };


  return (
    <>
      <section className='store mt-4'>
        <div className=" flex items-center justify-center w-full uppercase font-medium ppsL"><h1 className="sp-title" style={{ fontSize: "150%" }}>{getLinlName || "Stores locator"}</h1></div>
        {latitude !== null && longitude !== null && address !== null ?
          <div className="container">

            {/* <StoreSearch res={StoreSearchRes} st={searchT} /> */}
            {renderSearchHtml()}

            <div className="row pt-3">
              <div className="col-xl-6">
                <div className="store-map">
                  <div className="responsive-map" data-aos="zoom-out">
                    <Map
                      stores={dataSet}
                      latitudeTo={latitude}
                      longitudeTo={longitude}
                      locationId={locationId}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-6 storeLocator_card_root" data-aos="fade-left">
                <div className="mt-xl-0">
                  {dataSet?.length ? dataSet?.map((v: any, i: number) =>
                    <div
                      className="storeLocator_card mb-3"
                      key={i}
                      onMouseEnter={() => setLocationId(v?.id)}
                      onMouseLeave={() => setLocationId()}
                    >
                      <div className="card-body h-full">
                        <div className='part1'>
                          <div className='india_root'>
                            <Image src={indiaIcon} alt='indiaIcon' width={15} height={15} />
                            <p className='india'>INDIA</p>
                          </div>
                          <h3 className='title'>{v?.title}</h3>
                          <p className='store-para'>{v?.address_1?.length > 90 ? `${trimmedTxt(v?.address_1, 90)}...` : `${v?.address_1}`}</p>
                          <p className='store-title'><b ><i className="fa-solid fa-phone"></i></b> <span><a href={`tel:${v?.phone_no}`} style={{ fontSize: "16px" }}> {v?.phone_no}</a></span></p>
                        </div>

                        <div className="part2 direction">
                          <div className="px-0">
                            <p className='store-para distence'>{calculateDistance(latitude, longitude, +v?.latitude, +v?.longitude).toFixed(2)}&nbsp;Km</p>
                          </div>
                          <div className="">
                            <Link href={`${directions}`} target='_blank'>
                              <button
                                className='show-btn'
                                onMouseEnter={() =>
                                  setDirections(navigateToGoogleMaps(latitude, longitude, +v?.latitude, +v?.longitude))
                                }
                                onMouseLeave={() =>
                                  setDirections()
                                }
                              >DIRECTION</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div> : <div className=" d-flex flex-col align-items-center justify-content-center">
            <Image
              src={LocationGif}
              // src="https://cdn-icons-mp4.flaticon.com/512/6844/6844595.mp4"
              alt="Loading"
              width={192} // Specify width
              height={108} // Specify height
              style={{ height: "150px", width: "auto" }}

            /> <h4>Please allow your <span className='px-2 text-white rounded cursor-pointer bg-e4509d' onClick={() => handleGetLocation()}>location !</span></h4> </div>}

      </section>
    </>
  )
}

export default Storelocator