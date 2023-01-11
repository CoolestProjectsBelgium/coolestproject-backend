import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs'

import styled from 'styled-components'
import {
    Box,
    //H2,
    H5,
    H4,
    Text,
    //Illustration,
    //IllustrationProps,
    //Icon,
    //IconProps,
    //Button,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    //Tooltip
} from '@adminjs/design-system'

const pageHeaderHeight = 284
const pageHeaderPaddingY = 74
const pageHeaderPaddingX = 250
const api = new ApiClient()
const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}

export const DashboardHeader = () => {
    const [data, setData] = useState({})

    useEffect(() => {
        let isSubscribed = true
        api.getDashboard().then((response) => {
            console.log(response)
            setData(response.data)
        })
        return () => isSubscribed = false
    }, [])

    return (
        <Box position="relative" overflow="hidden">
            <Box
                bg="grey100"
                height={pageHeaderHeight}
                py={pageHeaderPaddingY}
                px={['default', 'lg', pageHeaderPaddingX]}
            >
                <Text textAlign="center" color="white">
                    <h2>{data.event_title} starting on {data.eventBeginDate !== undefined ? new Intl.DateTimeFormat('en-BE', options).format(new Date(data.eventBeginDate)) : 'No event'}</h2>
                    <Text>{data.days_remaining} days remaining</Text>
                </Text>
            </Box>
        </Box >
    )
}


const Card = styled(Box)`
  display: ${({ flex }) => (flex ? 'flex' : 'block')};
  color: ${({ theme }) => theme.colors.grey100};
  text-decoration: none;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary100};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`

Card.defaultProps = {
    variant: 'white',
    boxShadow: 'card',
}

export const Dashboard = () => {
    const [data, setData] = useState({})

    useEffect(() => {
        let isSubscribed = true
        api.getDashboard().then((response) => {
            setData(response.data)
        })
        return () => isSubscribed = false
    }, [])

    return (
        <Box>
            <DashboardHeader />
            <Box
                mt={['xl', 'xl', '-100px']}
                mb="xl"
                mx={[0, 0, 0, 'auto']}
                px={['default', 'lg', 'xxl', '0']}
                position="relative"
                flex
                flexDirection="rows"
                flexWrap="wrap"
                justify-content="space-between"
                align-content="flex-start"
                width={[1, 1, 1, 1024]}
            >
                <Box width={[1, 1, 1 / 2]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H4>Status Registrations</H4>
                            <ul>
                                <li>{data.pending_users} Registrations Pending</li>
                                <li>{data.overdue_registration} Overdue registrations</li>
                                <li>{data.waiting_list} On waiting list</li>
                                <li>{data.total_unusedVouchers} unused vouchers</li>
                            </ul>
                        </Box>
                    </Card>
                </Box>
                <Box width={[1, 1, 1 / 2]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H4>Status Projects</H4>
                            <ul>
                                <li>{data.total_projects}/{data.maxRegistration} Projects Remaining  / with {data.total_usedVouchers} Co-Worker(s)</li>
                                <li>{data.total_users - data.total_usedVouchers - data.total_projects} user(s) without Project</li>
                                <li>{data.total_videos} Project(s) with videos loaded</li>
                            </ul>
                        </Box>
                    </Card>
                </Box>
                <Box width={[1, 1, 1 / 2]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H4>Statistics Users ({data.total_users})</H4>
                            <Box flex flexDirection="rows" justify-content="space-between" position="relative">
                                <Box width={[1, 1, 1]}>
                                    <H5>Languages</H5>
                                    <ul>
                                        <li>{data.tlang_nl || 0} nl</li>
                                        <li>{data.tlang_fr || 0} fr</li>
                                        <li>{data.tlang_en || 0} en</li>
                                    </ul>
                                </Box>
                                <Box width={[1, 1, 1]}>
                                    <H5>Sex</H5>
                                    <ul>
                                        <li>{data.total_females || 0} females</li>
                                        <li>{data.total_males || 0} males</li>
                                        <li>{data.total_X || 0} X</li>
                                    </ul>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Box>
                <Box width={[1, 1, 1]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H5>Answers</H5>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>total</TableCell><TableCell>short</TableCell><TableCell>description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.questions && data.questions.map((question) =>
                                        <TableRow key={question.id}>
                                            <TableCell>{question.total}</TableCell>
                                            <TableCell>{question.short}</TableCell>
                                            <TableCell>{question.description}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Card>
                </Box>
                <Box width={[1, 1, 1]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H5>T-Shirts</H5>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>total</TableCell><TableCell>short</TableCell><TableCell>description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.tshirts && data.tshirts.map((tshirt) =>
                                        <TableRow key={tshirt.id}>
                                            <TableCell>{tshirt.total}</TableCell>
                                            <TableCell>{tshirt.short}</TableCell>
                                            <TableCell>{tshirt.description}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard