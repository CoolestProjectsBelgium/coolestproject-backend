// ./my-new-action.jsx
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
    TableBody,
    TableCell,
    TableHead,
    Tooltip
} from '@adminjs/design-system'

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

const EventDashboardAction = (props) => {
    const { resource, action, record, property } = props
    console.log(props)
    return (
        <Box>
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
        </Box>
    )
}

export default EventDashboardAction