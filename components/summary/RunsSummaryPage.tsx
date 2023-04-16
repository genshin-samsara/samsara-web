import {Button, Container, Header, Icon, Ref} from "semantic-ui-react";
import React, {ReactNode, useState} from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import RunsCounterSummary from "@/components/summary/stat/RunsCounterSummary";
import {Order} from "@/lotypes/sort";

type Properties = {
    data: { featuredList: Featured[] }
    title: ReactNode
    type: string
}
export default function RunsSummaryPage(
    {
        data,
        title,
        type,
    }: Properties
) {
    const ref = React.useRef<any>()
    const [order, setOrder] = useState('desc' as Order)

    return (
        <>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'} as={'h1'}>{title}</Header>

                <p>This page lists out the total runs of featured character/weapons.</p>

                <Button.Group widths={2}>
                    <Button active onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')} fluid>
                        Runs <Icon name={'sort'}/>
                    </Button>
                </Button.Group>
            </Container>

            <Ref innerRef={ref}>
                <Container style={{marginTop: '2em'}}>
                    <RunsCounterSummary
                        type={type}
                        order={order}
                        featuredList={data.featuredList}
                    />
                </Container>
            </Ref>

            <Container style={{marginTop: '1em'}} textAlign={"center"}>
                <PngDownloadButton node={ref} name={'summary'}
                                   type={type}
                />
            </Container>
        </>
    )
}
