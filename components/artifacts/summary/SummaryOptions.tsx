import {Container, Form, Icon, Label, Radio} from "semantic-ui-react";
import React, {useEffect, useState} from "react";

type Properties = {
    sortBy: string
    setSortBy: (sort: string) => any
    order: string
    setOrder: (order: string) => any
    limitedOnly: boolean
    setLimitedOnly: (limitedOnly: boolean) => any
    showLimitedOnly?: boolean
}

export default function SummaryOptions(
    {
        sortBy,
        order,
        limitedOnly,
        setSortBy,
        setOrder,
        setLimitedOnly,
        showLimitedOnly = false,
    }: Properties
) {
    const [ssr, setSsr] = useState(true)

    useEffect(() => setSsr(false), [])

    if (ssr) {
        return null
    }

    return (
        <Container text style={{marginTop: '2em'}}>
            <Form>
                <Form.Field>
                    <label>Sort By</label>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            label='Days since Last Run'
                            value='last-day'
                            checked={sortBy === 'last-day'}
                            onChange={() => setSortBy('last-day')}
                        />
                        <Form.Radio
                            label='Banners since Last Run'
                            value='last-banner'
                            checked={sortBy === 'last-banner'}
                            onChange={() => setSortBy('last-banner')}
                        />
                        <Form.Radio
                            label='Patches since Last Run'
                            value='last-patch'
                            checked={sortBy === 'last-patch'}
                            onChange={() => setSortBy('last-patch')}
                        />
                    </Form.Group>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            label='Avg. # of Banners in Between'
                            value='avg-banner'
                            checked={sortBy === 'avg-banner'}
                            onChange={() => setSortBy('avg-banner')}
                        />
                        <Form.Radio
                            label='Avg. # of Patches in Between'
                            value='avg-patch'
                            checked={sortBy === 'avg-patch'}
                            onChange={() => setSortBy('avg-patch')}
                        />
                        <Form.Radio
                            label='Avg.# of Days in Between'
                            value='avg-days'
                            checked={sortBy === 'avg-days'}
                            onChange={() => setSortBy('avg-days')}
                        />
                    </Form.Group>
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label
                            onClick={() => setOrder(order == 'desc' ? 'asc' : 'desc')}
                            className={'button'}>
                            {order == 'asc' ? (
                                <><Icon name={'sort amount up'} size={'small'}/> Ascending</>
                            ) : (
                                <><Icon name={'sort amount down'} size={'small'}/> Descending</>
                            )}
                        </Label>
                    </Form.Field>

                    {showLimitedOnly && (
                        <Form.Field>
                            <Radio toggle label='Hide Standard Characters'
                                   onChange={() => setLimitedOnly(!limitedOnly)}
                                   checked={limitedOnly}
                            />
                        </Form.Field>
                    )}
                </Form.Group>

            </Form>
        </Container>
    )
}