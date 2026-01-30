import { useState } from "react";

export function usePaging(
    initialRowsPerPage: number
) {
    const [page, setPage] = useState(1)
    const [rowsPerPage, _setRowsPerPage] = useState(initialRowsPerPage)
    const [totalPage, setTotalPage] = useState(1)

    const changePageBy = (pageDelta: number) => {
        let newPage = page + pageDelta
        if (newPage < 1) {
            newPage = 1
        }
        if (newPage > totalPage) {
            newPage = totalPage
        }

        if (newPage == page) return

        setPage(newPage)
    }

    const setRowsPerPage = (newRowsPerPage: number) => {
        _setRowsPerPage(newRowsPerPage)
        setPage(1)
    }

    return { page, rowsPerPage, totalPage, changePageBy, setRowsPerPage, setTotalPage, setPage }
}