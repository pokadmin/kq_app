import React from 'react'
import styled from 'styled-components'
import {readRemoteFile} from "react-papaparse";
import {usePagination, useTable} from "react-table";


const Styles = styled.div`
  padding: 1rem;
  
  .user {
    background-color: blue;
    color: white;
  }
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

  .pagination {
    padding: 0.5rem;
  }
`

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
                   columns,
                   data,
                   fetchData,
                   loading,
                   pageCount: controlledPageCount,
               }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,

        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,

        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 2, pageSize: 1, answerStatus: "No questions attempted yet."}
        },
        usePagination
    )

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({data, pageSize})
    }, [fetchData, data, pageSize])

    // Render the UI for your table
    return (
        <>
      <pre>
        <code>
          {JSON.stringify(
              {
                  pageIndex,
                  pageSize,
                  pageCount,
                  canNextPage,
                  canPreviousPage,
              },
              null,
              2
          )}
        </code>
      </pre>
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
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                <tr>
                    {loading ? (
                        // Use our custom loading state to show a loading indicator
                        <td colSpan="10000">Loading...</td>
                    ) : (
                        <td colSpan="10000">
                            Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                            results
                        </td>
                    )}
                </tr>
                </tbody>
            </table>
            {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                {' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                {' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                {' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                {' '}
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
                <span>
          | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{width: '100px'}}
                    />
        </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[1, 2].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

const headerNamesKQ = ["0", "1", "2", "3", "4", "5", "6", "Explanation", "PoK Program Link", "PoK Podcast Link", "Contributor", "Verifier", "Verified"]

function App() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Choose and Answer: Click on the header above the column with your Answer!',

                columns: [
                    {
                        Header: 'Question',
                        accessor: headerNamesKQ[0],
                    },
                    {
                        accessor: headerNamesKQ[1],
                    },
                    {
                        accessor: headerNamesKQ[2],
                    },
                    {
                        accessor: headerNamesKQ[3],
                    },
                    {

                        accessor: headerNamesKQ[4],
                    },
                    {
                        Header: 'Click to select',
                        accessor: headerNamesKQ[5],
                    },
                    {
                        Header: 'Click to select',
                        accessor: headerNamesKQ[6],
                    },

                ],
            },
        ],
        []
    )
    // We'll start our table without any data
    const [data, setData] = React.useState([])
    // const [answerStatus, setAnswerStatus] = React.useState("No answers yet")
    const [loading, setLoading] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)
    // const fetchIdRef = React.useRef(0)
    //const data = React.useMemo(() => makeData(100000), [])
    const q1_url = "https://raw.githubusercontent.com/pokadmin/kq_app/main/public/data/cleaned_questions_set_1.tsv"
    // const fetchData = React.useCallback(({results}) => {
    //         console.log('Results:', results);
    //         setData(results.data);
    //         setPageCount(Math.ceil(results.data.length / 1))
    //         setLoading(false)
    //     },[]
    // )

      const fetchData =
        (results) => {
            console.log('Results:', results);
            setData(data,results.data );
        }
readRemoteFile(q1_url, {  fetchData  })


    return (
        <Styles>
            <Table
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}
                pageCount={pageCount}
            />
        </Styles>
    )
}

export default App

