import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Picture from "../components/Picture";
import axios from "axios";

const Homepage = () => {
  let [input, setInput] = useState(""); // 從Search input得到即時改變的值
  let [data, setData] = useState(null);
  let [page, setPage] = useState(1);
  let [currentSearch, setCurrentSearch] = useState("");
  const auth = "Feh1WX5hjU5tbT4ETVjKMHiDLzwUtPoBhx6efeIY2rZgu8iDbAUNVGuI";
  // https://api.pexels.com/v1/curated =>curated?page=1&per_page=15
  // API設定 拿第1個頁面的15張照片
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  let searchURL = `https://api.pexels.com/v1/search?query=${input}&per_page=15&page=1`;

  // 訪問API大部分的寫法:axios.get{url,{headers: { Authorization: key}}}
  const search = async (url) => {
    let result = await axios.get(url, {
      headers: { Authorization: auth },
    });
    console.log(result);
    setData(result.data.photos); // 觸發setData 就會使頁面重新渲染,所以底下的data.map也會有值,就會啟動
    setCurrentSearch(input);
  };

  // Closure
  const morePicture = async () => {
    let newURL;
    setPage(page + 1); // 產生Closure
    // 判斷更新更多圖片要使用更多精選圖片,還是搜尋正在搜尋的
    // 可以判斷input欄位有沒有值
    if (currentSearch === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page + 1}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${
        page + 1
      }`;
    }
    let result = await axios.get(newURL, {
      headers: { Authorization: auth },
    });
    setData(data.concat(result.data.photos));
  };

  // useEffect 每次渲染的時候 都會執行裡面的函式
  useEffect(() => {
    search(initialURL);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* 將search以及setInput 用props的方式傳過去,就可以使用此函式 */}
      <Search
        search={() => {
          search(searchURL);
        }}
        setInput={setInput}
      />
      <div className="pictures">
        {data &&
          data.map((d) => {
            // 將Picture的props設定成data,接收d
            return <Picture data={d} />;
          })}
      </div>
      <div className="morePicture">
        <button onClick={morePicture}>更多圖片</button>
      </div>
    </div>
  );
};

export default Homepage;

/**
 * 為了確保 search(searchURL) 在 <Search /> 組件中被觸發時
 * 能夠保持正確的上下文
 * 如果直接寫成 search(searchURL)，它會在組件初次渲染時被立即執行
 * 使用匿名箭頭函式包裹 search(searchURL)，可以確保它在事件觸發時才執行
 */
{
  /* 
<Search search={search} setInput={setInput} />
<Search search={() => { search(searchURL); }} />; 
*/
}
