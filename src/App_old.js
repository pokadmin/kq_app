import React, {Component} from 'react'
import styled from 'styled-components'
import {readRemoteFile} from "react-papaparse";
import {useColumnOrder, usePagination, useTable} from 'react-table'

const headerNamesKQ = ["0", "1", "2", "3", "4", "5", "6", "Explanation", "Link", "Contributor", "Verifier", "Verified"]

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
        setColumnOrder,
        visibleColumns,
        state: {pageIndex, kQColumnOrder},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 1, pageSize: 1, kQColumnOrder: [], answerStatus: "No questions attempted yet."}
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

    function randomizeNextPage() {
        const co = randomizeColumns();

        return nextPage();
    }

    function gotoPageRandomized(page) {
        const co = randomizeColumns();

        gotoPage(page)
    }

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

// Components / Classes are better...
// How to convert :
// https://www.digitalocean.com/community/tutorials/five-ways-to-convert-react-class-components-to-functional-components-with-react-hooks
class App extends Component {
    state = {
        // initial state
        rows: [],
        columns: [],
        data: [],
        potentialAnswers: [],
        correctIndex: -1,
        kQColumnOrder: [],
        guess_count: 0,
        correct_count: 0,
        explanation: "No explanation",
        links: "no links",
        answerStatus: "You have not yet answered any questions. Click on the header to select an answer",
    }

    componentDidMount() {

        const q1_url = "https://raw.githubusercontent.com/pokadmin/kq_app/main/public/data/cleaned_questions_set_1.tsv"
        const q2_url_local = "http://localhost:3000/data/cleaned_questions_set_1.tsv"
        const question_set_urls = [q1_url, q2_url_local]

        function getMyHeaderName() {
            return "my header";
        }

        this.setState({
            columns: [

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
            rows: [],
            kQColumnOrder:[],
        })

        readRemoteFile(question_set_urls[1], {
            complete: (results) => {
                console.log('Results:', results);
                this.setState({
                    // update state
                    rows: results.data,
                    data: results,
                    explanation: "No explanation",
                    links: "no links",
                    kQColumnOrder: [],

                    answerStatus: "You have not yet answered any questions. Click on the header to select an answer",
                });
            },
        })


    }


    render() {
        return (
            <Styles>
                <h1>  {"To see the explanation click in the row with the answers."}</h1>
                <Table
                    columns={
                    this.state.columns
                }
                       data=
                           {
                               this.state.rows
                           }
                       getHeaderProps={column => ({
                           onClick: () => {
                               this.my_anwser_handler(column)
                           },
                           style:
                               {
                                   background: (("0" === String(column.id)) ? 'rgba(222,200,0,.4)' : 'rgba(0,0,230,.1)'),
                               }

                       })}

                       getRowProps={row => ({

                           value: "this is a value",

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
                    <h1>  {this.state.answerStatus}.</h1>
                </div>
            </Styles>
        )
    }

    currentRow(row) {
        let original_ = row
        if (original_) {
            let explanation_ = row.original[7]
            let links = row.original[8]
            let contributor = row.original[9]

            this.setState({explanation: explanation_})
            return alert("Here is the explanation: \n" + explanation_ + "\nlinks: " + links + "\ncontributor" + contributor);

        }
    }

    my_anwser_handler(column) {
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
}

export default App
