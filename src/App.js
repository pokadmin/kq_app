import React from 'react'
import styled from 'styled-components'
import {useTable} from 'react-table'
import {readRemoteFile} from "react-papaparse";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({columns, data}) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

function App() {
    const headerNames = ["0", "1", "2", "3", "4", "5", "6", "1b", "2b", "Explanation", "Link", "Contributor", "Verifier", "Verified"]
    const columns = React.useMemo(
        () => [

            {

                Header: 'Question/Answers',
                columns: [
                    {
                        Header: headerNames[0],
                        accessor: headerNames[0],
                    },
                    {
                        Header: headerNames[1],
                        accessor: headerNames[1],
                    },
                    {
                        Header: headerNames[2],
                        accessor: headerNames[2],
                    },
                    {
                        Header: headerNames[3],
                        accessor: headerNames[3],
                    },
                    {
                        Header: headerNames[4],
                        accessor: headerNames[4],
                    },
                    {
                        Header: headerNames[5],
                        accessor: headerNames[5],
                    },
                ],
            },
        ],
        []
    )
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        readRemoteFile('https://raw.githubusercontent.com/pokadmin/kq_app/main/src/data/cleaned_questions_set_1.tsv', {
            complete: (results) => {
                console.log('Results:', results);
                setRows(results.data);
            },
        })
    }, []);
    console.log(rows);


    return (

        <Styles>
            <Table columns={columns} data={rows}/>
        </Styles>
    )
}

export default App
