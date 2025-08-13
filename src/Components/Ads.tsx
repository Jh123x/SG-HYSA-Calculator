import React from "react";


export const Ads = () => {
    const showAds = localStorage.getItem('show_ads') !== 'false';

    if (!showAds) document.getElementById('ads')?.remove();
    return <></>
}