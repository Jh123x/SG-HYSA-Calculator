import React from "react";


export const Ads = () => {
    const showAds = localStorage.getItem('showAds') !== 'false';
    if (!showAds) return <></>

    const script = document.createElement('script');
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1199924535485592"
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    return <>{script}</>
}