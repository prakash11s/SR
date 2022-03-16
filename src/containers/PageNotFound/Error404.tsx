import React from 'react'

const Error404Lazy = React.lazy(() => import('../../components/Error404'));
// Error 4O4 component
export default function Error404({ loading }:any) {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Error404Lazy />
        </React.Suspense>
    );
}
