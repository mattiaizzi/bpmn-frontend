import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Topic } from "../../../../models/topic"

interface TopicTableProps {
  topics: Topic[];
  onDeleteTopic: (id: string) => void
}

const columns = ['Key', 'Name', 'Message Type'];

const TopicTable: React.FC<TopicTableProps> = ({ topics = [], onDeleteTopic }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {
              columns.map(column => <TableCell key={column}>{column}</TableCell>)
            }
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topics.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.messageType}</TableCell>
              <TableCell><DeleteIcon onClick={() => onDeleteTopic(row._id)}/></TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TopicTable;