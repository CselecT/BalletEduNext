import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Callout } from '@radix-ui/themes'
import React, { PropsWithChildren } from 'react'

const ErrorMessage = ({ children }: PropsWithChildren) => {
    if (!children) return null;
    return (
        <Callout.Root color="red" role="alert" className='mb-5'>
            <Callout.Icon>
                <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
                {children}
            </Callout.Text>
        </Callout.Root>
    )
}

export default ErrorMessage