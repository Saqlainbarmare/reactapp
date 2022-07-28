import { useState, useEffect, useRef } from "react";
import Loading from "./loading.gif";

function App() {
  const [photos, setPhotos] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async (pageNumber) => {
    const Access_Key = "KrpuRcqVOR2U8EgBgxE8Gw00_VxD_xe4r1NjOgYAbL0";
    const res = await fetch(
      `https://api.unsplash.com/photos/?client_id=${Access_Key}&page=${pageNumber}&per_page=10`
    );
    const data = await res.json();
    setPhotos((photo) => [...photo, ...data]);
    setLoading(true);
  };

  useEffect(() => {
    fetchPhotos(pageNumber);
  }, [pageNumber]);

  const load = () => {
    setPageNumber((prePageNumber) => prePageNumber + 1);
  };

  const bottomPage = useRef();
  let num = 1;
  useEffect(() => {
    if (loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            num++;
            load();
            if (num > 10) {
              observer.unobserve(bottomPage.current);
            }
          }
        },
        { threshold: 1 }
      );
      observer.observe(bottomPage.current);
    }
  }, [loading, num]);

  return (
    <div className="App">
      <h1>Photo mash</h1>
      {photos.map((photo, index) => (
        <div className="photos" key={index}>
          <img src={photo.urls.small} alt="" />
          <p>{photo.user.first_name + " " + photo.user.last_name}</p>
          <span>Like: {photo.user.total_likes}</span>
        </div>
      ))}

      <div className="loading">
        <img src={Loading} alt="" />
      </div>
      <h3>{photos.length}</h3>
      <button onClick={load} ref={bottomPage}>
        Load More
      </button>
    </div>
  );
}

export default App;
