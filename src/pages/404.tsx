import Styled from "styled-components";
import type { NextPage } from 'next';
import Head from 'next/head';
import React from "react";


const Alert = Styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #020309;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  cursor: pointer;
  z-index: 97;
`


const NotFound404:NextPage = () => {
	return (
    <>
    <Head>
      <title>Framely - 404</title>
    </Head>
    <Alert>
      Framely - Sorry, we don&apos;t found it (404)
    </Alert>
    </>
	);
}

export default NotFound404;
