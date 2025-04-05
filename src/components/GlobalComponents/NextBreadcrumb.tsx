import React, { ReactNode } from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

type TBreadCrumbProps = {
    homeElement: ReactNode,
    separator: ReactNode,
    containerClasses?: string,
    listClasses?: string,
    activeClasses?: string,
    capitalizeLinks?: boolean
}

const NextBreadcrumb = ({ homeElement, separator, containerClasses, listClasses, activeClasses, capitalizeLinks }: TBreadCrumbProps) => {

    const paths = usePathname()
    const pathNames = paths.split('/').filter(path => path)

    return (
        <div>
            <div className={containerClasses} style={{ color: "#989898", fontSize: "15px" }}>
                <div className={listClasses} style={{ color: "#989898", fontSize: "15px" }}><Link href={'/'} style={{ color: "#989898", fontSize: "15px" }}>{homeElement}</Link></div>
                {pathNames.length > 0 && separator}
                {
                    pathNames.map((link, index) => {
                        let href = `/${pathNames.slice(0, index + 1).join('/')}`
                        let itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses
                        let itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link
                        return (
                            <React.Fragment key={index}>
                                <div className={itemClasses} style={{ color: "#989898", fontSize: "15px" }} >
                                    <Link href={href} style={{ color: "#989898", fontSize: "15px" }}>{itemLink}</Link>
                                </div>
                                {pathNames.length !== index + 1 && separator}
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default NextBreadcrumb