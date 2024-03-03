'use client'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import React from 'react'
import NewTeacher from './NewTeacher'

interface Props {
    params: { schoolId: string }
}

const NewTeacherDialog = ({ params }: Props) => {
    return (
        <Dialog.Root >
            <Dialog.Trigger>
                <Button variant="surface">Register Teacher</Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Register Teacher </Dialog.Title>
                <Flex direction="column" gap="3">
                    <NewTeacher params={{ schoolId: params.schoolId }} />
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
export default NewTeacherDialog