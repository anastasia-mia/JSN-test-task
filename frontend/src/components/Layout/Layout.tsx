import {Suspense} from "react";
import {Outlet} from "react-router-dom";
import {Header} from "../Header/Header.tsx";
import {Footer} from "../Footer/Footer.tsx";

export const Layout = () => {
    return (
        <>
            <Header/>
            <div className="content-wrap">
                <div className="wrapper">
                    <div className="container">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Outlet/>
                        </Suspense>
                    </div>
                </div>

            </div>
            <Footer/>
        </>
    )
}