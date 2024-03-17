import React from 'react';

export default function Loading() {
    return (
        <div className="text-center position-absolute top-50 start-50 translate-middle">
            <div
                className="spinner-border text-light"
                style={{width: "4rem", height: "4rem"}}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-light mt-2">LOADING...</div>
        </div>
    )
}