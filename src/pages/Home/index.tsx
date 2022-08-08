import { HandPalm, Play } from 'phosphor-react'
import { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../context/CyclesContext'

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(3, 'Tarefa muito curta').max(50, 'Tarefa muito longa'),
	minutesAmount: zod
		.number()
		.min(5, 'Ciclo de no mínimo 5 minutos')
		.max(60, 'Ciclo de no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
	const { activeCycle, createNewCycle, interruptCurrentCycle } =
		useContext(CyclesContext)

	const newCycleForm = useForm<newCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		},
	})

	const { handleSubmit, watch, reset } = newCycleForm

	function handleCreateNewCycle(data: newCycleFormData) {
		createNewCycle(data)
		reset()
	}

	const task = watch('task')
	const isSubmitDisabled = !task || task.length < 3

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
				<FormProvider {...newCycleForm}>
					<NewCycleForm />
				</FormProvider>
				<Countdown />

				{activeCycle ? (
					<StopCountdownButton onClick={interruptCurrentCycle} type='button'>
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisabled} type='submit'>
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	)
}
