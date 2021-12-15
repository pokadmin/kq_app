import React from 'react'
import styled from 'styled-components'
import {readRemoteFile} from "react-papaparse";
import {useColumnOrder, usePagination, useTable} from 'react-table'

import makeData from './makeData'

const headerNamesKQ = ["0", "1", "2", "3", "4", "5", "6", "Explanation", "Link", "Contributor", "Verifier", "Verified"]
const q1_url = "https://raw.githubusercontent.com/pokadmin/kq_app/main/public/data/cleaned_questions_set_1.tsv"
const q2_url_local = "http://localhost:3000/data/cleaned_questions_set_1.tsv"
const question_set_urls = [q1_url, q2_url_local]

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

  .pagination {
    padding: 0.5rem;
  }
`

function shuffle(arr) {
    arr = [...arr]
    const shuffled = []
    while (arr.length) {
        const rand = Math.floor(Math.random() * arr.length)
        shuffled.push(arr.splice(rand, 1)[0])
    }
    return shuffled
}

// Create a default prop getter
const defaultPropGetter = () => ({})

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
                   columns,
                   data,
                   getHeaderProps = defaultPropGetter,
                   getColumnProps = defaultPropGetter,
                   getRowProps = defaultPropGetter,
                   getCellProps = defaultPropGetter,

                   fetchData,
                   loading,
                   pageCount: controlledPageCount,
               }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,

        setColumnOrder,
        visibleColumns,
        state: {pageIndex, kQColumnOrder},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 1, pageSize: 1, kQColumnOrder: []}
        },
        useColumnOrder,
        usePagination
    )
    // eslint-disable-next-line no-unused-vars
    const randomizeColumns = () => {

        let question_item = visibleColumns[0]
        let random_order = shuffle(visibleColumns.map(d => d.id))
        // We shuffled all items, good cause we want random order. But we want the question first. Swapp
        let question_item_random_index = random_order.indexOf(question_item.id)
        let non_question_item_at_0 = random_order[0]
        random_order[0] = "0"
        random_order[question_item_random_index] = non_question_item_at_0
        setColumnOrder(random_order)
        return random_order
    }


    function gotoPageRandomized(page) {
        const co = randomizeColumns();

        gotoPage(page)
    }
    function randomizeNextPage() {
        const co = randomizeColumns();

        return nextPage();
    }

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({pageIndex, kQColumnOrder})
    }, [fetchData, pageIndex, kQColumnOrder])

    // Render the UI for your table
    return (
        <>
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
                <button onClick={() => randomizeNextPage()} disabled={!canNextPage}>
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
                            gotoPageRandomized(page);
                        }}
                        style={{width: '100px'}}
                    />
        </span>{' '}

            </div>

            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th

                                {...column.getHeaderProps([
                                    {
                                        Header: "sdaf",
                                        className: column.className,
                                        style: column.style,
                                    },
                                    {
                                        ...column.Header =
                                            <div
                                                style={{textAlign: 'right', fontVariantNumeric: 'tabular-nums'}}
                                            > {column.id} </div>

                                    },

                                    getColumnProps(column),
                                    getHeaderProps(column),
                                ])}
                            >
                                {column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps(getRowProps(row))}>
                            {row.cells.map(cell => {

                                return <td {...cell.getCellProps(getCellProps(cell))}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>

            <pre>

        <code>

          {JSON.stringify(
              {
                  pageIndex,
                  pageCount,
                  //   canNextPage,
                  //   canPreviousPage,
                  //   answerStatus,
              },
              null,
              2
          )}
        </code>
      </pre>
        </>
    )
}

// Let's simulate a large dataset on the server (outside of our component)
const serverData = makeData(10000)
 const currentRow = (row) => {
        let original_ = row
        if (original_) {
            let explanation_ = row.original[7]
            let links = row.original[8]
            let contributor = row.original[9]

            this.setState({explanation: explanation_})
            return alert("Here is the explanation: \n" + explanation_ + "\nlinks: " + links + "\ncontributor" + contributor);

        }
    }

   const my_anwser_handler=(column)=> {
        let isCorrect = ("1" === String(column.id))
        let guess_count_ = this.state.guess_count + 1
        let correct_count_ = this.state.correct_count
        if (isCorrect) {
            correct_count_ = correct_count_ + 1
        }
        let percent = (correct_count_ / guess_count_) * 100
        let answerStatus_ = "You have " + correct_count_ + " correct answers and have guessed " + guess_count_ + " times. You are " + percent + "%  enlightened by our calculation"
        this.setState({guess_count: guess_count_, answerStatus: answerStatus_, correct_count: correct_count_})

        return alert(isCorrect ? String(column.id) + " is Correct!" + answerStatus_ : String(column.id) + " is WRONG!" + answerStatus_ + "\n  click on the row for an explanation.");
    }
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
        [],
        [],
    )

    // We'll start our table without any data
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)
    const [answerStatus, setAnswerStatus] = React.useState("No answers yet")

    const fetchIdRef = React.useRef(0)

                readRemoteFile(question_set_urls[1], {
                    complete:
                    },
                })
    const fetchData = React.useCallback(({pageSize, pageIndex}) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.

        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current

        // Set the loading state
        setLoading(true)

        // We'll even set a delay to simulate a server here
        setTimeout(() => {
            // Only update the data if this is the latest fetch
            if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex
                const endRow = startRow + pageSize


                // Your server could send back total page count.
                // For now we'll just fake it, too
                setPageCount(Math.ceil(serverData.length / pageSize))

                setLoading(false)
            }
        }, 1000)
    }, [])

      return (
            <Styles>
                <h1>  {"To see the explanation click in the row with the answers."}</h1>
                <Table
                 columns={columns}
        data={data}
        getHeaderProps={column => ({
          onClick: () => alert('Header!'),
        })}
        getColumnProps={column => ({
          onClick: () => alert('Column!'),
        })}
        getRowProps={row => ({
          style: {
            background: row.index % 2 === 0 ? 'rgba(0,0,0,.1)' : 'white',
          },
        })}
        getCellProps={cellInfo => ({
          style: {
            backgroundColor: `hsl(${120 * ((120 - cellInfo.value) / 120) * -1 +
              120}, 100%, 67%)`,
          },
        })}
      />
                <div>
                    <h1>  {answerStatus}.</h1>
                </div>
            </Styles>
        )

}
export default App
