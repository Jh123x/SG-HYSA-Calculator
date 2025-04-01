import { Link } from "@mui/material"
import React from "react"
import { primaryColor } from "../consts/colors.ts"


interface LocalLinkProps {
    href: string
    children?: React.ReactNode
}

export const LocalLink = ({
    href,
    children,
}: LocalLinkProps) => {
    return <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
            color: primaryColor,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
        }}
    >{children}</Link>
}