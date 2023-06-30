import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { blurbToggles } from '../components/blurbToggles';

const Page = () => {
    return (
        <>
            <div className="body"></div>
        </>
    );
};

const root = createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <Page />
    </React.StrictMode>
);
