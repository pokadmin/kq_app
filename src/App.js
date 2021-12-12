import React, {Component} from 'react'
import styled from 'styled-components'
import {readRemoteFile} from "react-papaparse";
import {useColumnOrder, usePagination, useTable} from 'react-table'

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

function Table({
                   columns,
                   data,
                   getHeaderProps = defaultPropGetter,
                   getColumnProps = defaultPropGetter,
                   getRowProps = defaultPropGetter,
                   getCellProps = defaultPropGetter

               }) {
    // Use the state and functions returned from useTable to build your UI
    let {
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
        setColumnOrder,
        visibleColumns,
        state: {pageIndex, pageSize, answerStatus},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 2, pageSize: 1, answerStatus: "None"}
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
        random_order[question_item_random_index]=non_question_item_at_0
        visibleColumns = random_order
        setColumnOrder(visibleColumns)
    }

    function my_nextPage() {
        return undefined;
    }

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
                  answerStatus,
              },
              null,
              2
          )}
        </code>
      </pre>
            <button onClick={() => randomizeColumns({})}>Randomize Columns</button>

            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps([
                                    {
                                        className: column.className,
                                        style: column.style,
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
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
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
                <button onClick={() => my_nextPage()} disabled={!canNextPage}>
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
                            gotoPage(page);
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
                    {[1, 2, 3, 4, 5, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div className="alert" hidden={true}>
                <strong>Danger!</strong> Indicates a dangerous or potentially negative action.
            </div>
        </>
    )
}

// Components / Classes are better...
// How to convert : https://www.digitalocean.com/community/tutorials/five-ways-to-convert-react-class-components-to-functional-components-with-react-hooks
class App extends Component {
    state = {
        // initial state
        rows: [],
        columns: [],
        data: [],
        potentialAnswers: [],
        correctIndex: -1,
        correctAnswer: "correctAnswer initial state",
        answerStatus: "answerStatus initial state"

    }

    componentDidMount() {

        const q1_url = "https://raw.githubusercontent.com/pokadmin/kq_app/main/src/data/cleaned_questions_set_1.tsv"
        const q2_url_local = "http://localhost:3000/data/cleaned_questions_set_1.tsv"
        const question_set_urls = [q1_url, q2_url_local]
        const headerNames = ["0", "1", "2", "3", "4", "5", "6", "1b", "2b", "Explanation", "Link", "Contributor", "Verifier", "Verified"]
        this.setState({
            columns: [

                {

                    Header: 'Question/Answers',
                    columns: [
                        {
                            accessor: headerNames[0],
                        },
                        {
                            accessor: headerNames[1],
                        },
                        {
                            accessor: headerNames[2],
                        },
                        {
                            accessor: headerNames[3],
                        },
                        {
                            accessor: headerNames[4],
                        },
                        {
                            accessor: headerNames[5],
                        },
                        {
                            accessor: headerNames[6],
                        },
                    ],
                },
            ],
            rows: []
        })

        readRemoteFile(question_set_urls[1], {
            complete: (results) => {
                console.log('Results:', results);
                this.setState({
                    // update state
                    rows: results.data,
                    data: results,
                    answerStatus: "Unknown",
                });
            },
        })


    }

    onAnswerSelected = e => {
        if (e.target.value) {
            const answerStatus_local = String(e.target.value)
            this.setState({answerStatus: answerStatus_local});
        }

    };

    render() {
        return (
            <Styles>
                <Table columns={
                    this.state.columns
                }
                       data=
                           {
                               this.state.rows
                           }
                       getHeaderProps={column => ({
                           onClick: () => alert(("1" === String(column.id)) ? String(column.id) + " is Correct!" : "is WRONG!")
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

                <select value="test" name="select List" id="selectList" onChange={this.onAnswerSelected}>
                    <option value="0">Select Answer</option>
                    <option value="1">Answer 1</option>
                    <option value="2">Answer 2</option>
                    <option value="3">Answer 3</option>
                    <option value="4">Answer 4</option>
                    <option value="5">Answer 5</option>
                    <option value="6">Answer 6</option>
                </select>
                <div>
                    <h1>You selected {this.state.answerStatus}:</h1>
                    <h1> That result is {(String(this.state.correctIndex) === "1") ? "Correct!" : "WRONG!"}!!!</h1>

                </div>
            </Styles>
        )
    }
}

export default App
