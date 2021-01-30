import React, { useState, useEffect } from 'react';
import { ApiClient } from 'admin-bro'

import styled from 'styled-components'
import {
    Box,
    H2,
    H5,
    H4,
    Text,
    Illustration,
    IllustrationProps,
    Icon, 
    IconProps,
    Button,
    Table,
    TableRow,
    TableCell,
    TableHead,
    Tooltip
} from '@admin-bro/design-system'

const pageHeaderHeight = 284
const pageHeaderPaddingY = 74
const pageHeaderPaddingX = 250
const api = new ApiClient()
const options =  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'}

export const DashboardHeader = () => {
    const [data, setData] = useState({})

    useEffect(() => {
        let isSubscribed = true
        api.getDashboard().then((response) => {
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
                    <h2>Current event starting on: {data.startDate !== undefined ? new Intl.DateTimeFormat('en-BE',options).format(new Date(data.startDate)) : 'No event'}</h2>
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
                flexDirection="row"
                flexWrap="wrap"
                width={[1, 1, 1, 1024]}
            >
                <Box width={[1, 1, 1 / 2]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H4>Status Registrations</H4>
                            <H5>{data.pending_users} Registrations Pending</H5>
                            <H5>{data.overdue_registration} Overdue registrations</H5>
                            <H5>{data.waiting_list} On waiting list</H5>
                        </Box>
                    </Card>
                </Box>
                <Box width={[1, 1, 1 / 2]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H4>Statistics Users</H4>
                            <H5>{data.total_users} Users</H5>
                            <H5>{data.total_males} Males</H5>
                            <H5>{data.total_females} Females</H5>
                            <H5>{data.total_X} X</H5>
                        </Box>
                    </Card>
                </Box>
                <Box width={[1, 1, 1 / 2]} p="lg">
                    <Card as="a" flex>
                        <Box ml="xl">
                            <H4>Status Projects</H4>
                            <H5>{data.total_projects}/{data.maxRegistration} Projects Remaining</H5>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard