import React from 'react';

import CircularProgress from './CircularProgress';

const Preloader = () => (
    <div className="preloader">
        {/* <img src={logo} /> */}
        <div>
        <h1 style={{color:'Orange'}}>Gilani Collection's</h1>
        </div>
        <CircularProgress />
    </div>
);

export default Preloader;
