import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Banners} from '@/banners/types'

import {
    Container,
    Header,
} from 'semantic-ui-react'


export const getServerSideProps = async () => {

    return {
        props: {
            banners: require('../public/data/banners.json')
        },
    };
};

type HomeProperties = {
    banners: Banners
}


export default function Home({banners}: HomeProperties) {
    console.log(banners)
    for (let characterKey in banners.characters["5"]) {

    }
    return (
        <>
            <Head>
                {/*<title>Create Next App</title>*/}
                {/*<meta name="description" content="Generated by create next app" />*/}
                {/*<meta name="viewport" content="width=device-width, initial-scale=1" />*/}
                {/*<link rel="icon" href="/favicon.ico" />*/}
            </Head>
            <Container text style={{marginTop: '7em'}}>
                {Object.keys(banners.characters["5"]).map((item: string, index)=>{
                    return <li key={index}>{item}: {banners.characters["5"][item]}</li>
                })}
            </Container>
        </>
    )
}
