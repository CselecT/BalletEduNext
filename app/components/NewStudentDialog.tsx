'use client'
import { Button, Callout, Dialog, Flex, Grid, Inset, Select, Switch, Table, TextArea, TextField } from '@radix-ui/themes'
// import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStudentSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import Datepicker from "tailwind-datepicker-react"
import NewStudent from './NewStudent'

type StudentFrom = z.infer<typeof createStudentSchema>

interface Props {
    params: { schoolId: string }
}

const NewStudentDialog = ({ params }: Props) => {

    return (
        <Dialog.Root >
            <Dialog.Trigger>
                <Button>Register Student</Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Register Student </Dialog.Title>
                {/* <Dialog.Description>
                The following users have access to this project.
            </Dialog.Description> */}

                <Flex direction="column" gap="3">
                    <NewStudent params={{ schoolId: params.schoolId }} />
                </Flex>
                <Flex gap="3" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Close
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )

}

export default NewStudentDialog