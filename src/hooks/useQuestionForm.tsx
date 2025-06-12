import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChoiceQuestionProps, QuestionProps } from "../components/inputs/questionInputs/ChoiceQuestions";
import { Choice, Question } from "../api/store_service_api";
import { ServiceQuestionForm } from "../components/inputs/questionInputs/ServiceQuestionForm";

interface CreateQuestionInfo {
    id: string;
    type: 'choiceImage' | 'choiceText' | 'text' | 'image';
    title?: string;
    titleError?: string;
    choices?: CreateChoiceInfo[];
}

interface CreateChoiceInfo {
    id: string
    option?: string;
    optionError?: string;
    image?: string;
    imageError?: string;
}

export const useQuestionForm = () => {
    const [voidQuestion, setVoidQuestion] = useState<CreateQuestionInfo>({ type: 'choiceImage', id: uuidv4() })
    const [questions, setQuestions] = useState<CreateQuestionInfo[]>([])

    const initNewQuestion = () => {
        const newVoidQuestion: CreateQuestionInfo = { id: uuidv4(), type: 'choiceImage', choices: [{ id: uuidv4() }] }
        setVoidQuestion(newVoidQuestion)
    }
    useEffect(() => {
        const questions = JSON.parse(localStorage.getItem('questions') || '[]') as CreateQuestionInfo[]
        setQuestions(questions)

    }, [])
    useEffect(initNewQuestion, [])

    const addTitle = (title: string, id: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, title: title }))
        }
        else {
            setQuestions(prev => prev.map(q => q.id === id ? { ...q, title: title } : q))
        }
    }

    const setQuestionType = (type: 'choiceImage' | 'choiceText' | 'text' | 'image') => {
        setVoidQuestion(prev => ({ ...prev, type: type }))
    }

    const addNewChoice = (id: string) => {
        const choiceId = uuidv4()
        const choice: CreateChoiceInfo = { id: choiceId }
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, choices: [...prev.choices ?? [], choice] }))
        }
        else {
            setQuestions(prev => prev.map(q => {
                if (q.id === id) {
                    return {
                        ...q,
                        choices: [...(q.choices ?? []), choice]
                    }
                }
                return q
            }))
        }
    }

    const addChoiceOption = (option: string, id: string, choiceId: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, choices: prev.choices?.map(c => c.id === choiceId ? { ...c, option: option } : c) }))
        }
        else {
            setQuestions(prev => prev.map(q => {
                if (q.id === id) {
                    return {
                        ...q,
                        choices: q.choices?.map(c => c.id === choiceId ? { ...c, option: option } : c)
                    }
                }
                return q
            }))
        }
    }

    const addChoiceImage = (image: string, id: string, choiceId: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, choices: prev.choices?.map(c => c.id === choiceId ? { ...c, image: image } : c) }))
        }
        else {
            setQuestions(prev => prev.map(q => {
                if (q.id === id) {
                    return {
                        ...q,
                        choices: q.choices?.map(c => c.id === choiceId ? { ...c, image: image } : c)
                    }
                }
                return q
            }))
        }
    }

    const deleteChoice = (id: string, choiceId: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, choices: prev.choices?.filter(c => c.id !== choiceId) }))
        }
        setQuestions(prev => prev.map(q => {
            if (q.id === id) {
                return {
                    ...q,
                    choices: q.choices?.filter(c => c.id !== choiceId)
                }
            }
            return q
        }))
    }

    const deleteQuestion = (id: string) => {
        const updatedQuestions = questions.filter(q => q.id !== id)
        setQuestions(updatedQuestions)
        localStorage.setItem('questions', JSON.stringify(updatedQuestions))
        console.log('Question deleted:', JSON.parse(localStorage.getItem('questions') || '[]'))
    }

    const addQuestion = (): boolean => {
        if (!validateQuestion()) return false
        const _questions = [...questions, voidQuestion]
        setQuestions(_questions)
        initNewQuestion()
        localStorage.setItem('questions', JSON.stringify(_questions))
        return true
    }

    const getQuestionProps = (id: string): QuestionProps => {
        const question = questions.find(q => q.id === id) ?? voidQuestion
        return {
            type: question.type,
            titleProps: {
                value: question.title,
                onValueChange: (value: string) => addTitle(value, question.id),
                error: question.titleError,
            },
            choicesProps: question.choices?.map(c => getChoiceProps(question.id, c.id)) ?? [],
            onAddChoice: () => addNewChoice(question.id),
        }
    }

    const getChoiceProps = (id: string, choiceId: string): ChoiceQuestionProps => {
        const question = questions.find(q => q.id === id) ?? voidQuestion
        const choice = question.choices?.find(c => c.id === choiceId)!
        return {
            type: question.type === 'choiceImage' ? 'image' : 'text',
            optionProps: {
                value: choice.option,
                onValueChange: (value: string) => addChoiceOption(value, id, choiceId),
                error: choice.optionError,
            },
            imageProps: {
                value: choice.image,
                onChange: (value: string) => addChoiceImage(value, id, choiceId),
                error: choice.imageError,
            },
            onDeleteChoice: () => deleteChoice(id, choiceId),
        }
    }

    const getQuestions = (): Question[] => questions.map(q => {
        return {
            id: q.id,
            title: q.title ?? '',
            inputType: q.type === 'text' ? 'TEXT' : q.type === 'image' ? 'IMAGE' : 'CHOICE',
            choiceType: q.type === 'choiceText' ? 'TEXT' : q.type === 'choiceImage' ? 'IMAGE' : undefined,
            choices: q.choices?.map(mapChoice),
        }
    })

    const mapChoice = (choice: CreateChoiceInfo): Choice => {
        return {
            option: choice.option ?? '',
            image: choice.image ?? '',
        }
    }

    const initQuestions = (questions: Question[]) => {
        const mappedQuestions: CreateQuestionInfo[] = questions.map(q => {
            return {
                id: q.id,
                type: q.inputType === 'TEXT' ? 'text' : q.inputType === 'IMAGE' ? 'image' : q.choiceType === 'TEXT' ? 'choiceText' : 'choiceImage',
                title: q.title,
                choices: q.choices?.map(c => ({ id: uuidv4(), option: c.option, image: c.image })),
            }
        })
        setQuestions(mappedQuestions)
    }

    const selectQuestion = (id: string) => {
        clearErrors()
        const question = questions.find(q => q.id === id) ?? voidQuestion
        const newQuestion: CreateQuestionInfo = { ...question, id: uuidv4(), titleError: '', choices:
            question.choices?.map(c => ({ ...c, optionError: '', imageError: '' }))
        }
        setVoidQuestion(newQuestion)
    }

    const validateQuestion = () => {
        clearErrors()
        let isValid = true
        if (voidQuestion.title === undefined || voidQuestion.title === '') {
            setTitleError('El título es requerido', voidQuestion.id)
            isValid = false
        }
        let isValidChoices = true
        voidQuestion.choices?.forEach((choice) => {
            if (!validateChoice(choice)) {
                isValidChoices = false
            }
        })
        return isValid && isValidChoices
    }

    const validateChoice = (choice: CreateChoiceInfo) => {
        let isValid = true
        if (voidQuestion.type === 'choiceText' && (choice.option === undefined || choice.option === '')) {
            setChoiceOptionError('La opción es requerida', voidQuestion.id, choice.id)
            isValid = false
        }
        if (voidQuestion.type === 'choiceImage') {
            if (choice.option === undefined || choice.option === ''){
                setChoiceOptionError('La opción es requerida', voidQuestion.id, choice.id)
                isValid = false
            }
            if (choice.image === undefined || choice.image === '') {
                setChoiceImageError('La imagen es requerida', voidQuestion.id, choice.id)
                isValid = false
            }
        }
        return isValid
    }

    const clearErrors = () => {
        setTitleError('', voidQuestion.id)
        voidQuestion.choices?.forEach(choice => {
            setChoiceOptionError('', voidQuestion.id, choice.id)
            setChoiceImageError('', voidQuestion.id, choice.id)
        })
    }

    const setTitleError = (error: string, id: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, titleError: error }))
        }
        else {
            setQuestions(prev => prev.map(q => q.id === id ? { ...q, titleError: error } : q))
        }
    }

    const setChoiceOptionError = (error: string, id: string, choiceId: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, choices: prev.choices?.map(c => c.id === choiceId ? { ...c, optionError: error } : c) }))
        }
        else {
            setQuestions(prev => prev.map(q => {
                if (q.id === id) {
                    return {
                        ...q,
                        choices: q.choices?.map(c => c.id === choiceId ? { ...c, optionError: error } : c)
                    }
                }
                return q
            }))
        }
    }

    const setChoiceImageError = (error: string, id: string, choiceId: string) => {
        if (voidQuestion.id === id) {
            setVoidQuestion(prev => ({ ...prev, choices: prev.choices?.map(c => c.id === choiceId ? { ...c, imageError: error } : c) }))
        }
        else {
            setQuestions(prev => prev.map(q => {
                if (q.id === id) {
                    return {
                        ...q,
                        choices: q.choices?.map(c => c.id === choiceId ? { ...c, imageError: error } : c)
                    }
                }
                return q
            }))
        }
    }

    const updateQuestion = (id: string) => {
        if (!validateQuestion()) return false
        const updatedQuestions = questions.map(q => {
            if (q.id === id) {
                return {...voidQuestion, id: id, titleError: '', choices: voidQuestion.choices?.map(c => {
                    return {
                        ...c,
                        optionError: '',
                        imageError: '',
                    }
                })}
            }
            return q
        })
        setQuestions(updatedQuestions)
        localStorage.setItem('questions', JSON.stringify(updatedQuestions))
        return true
    }

    const getProps = (): ServiceQuestionForm => {
        return {
            setQuestionType,
            newQuestionProps: getQuestionProps(voidQuestion.id),
            questions: getQuestions(),
            selectedQuestionProps: getQuestionProps(voidQuestion.id),
            selectQuestion,
            initNewQuestion,
            updateQuestion,
            deleteQuestion,
            addQuestion,
        }
    }

    return {
        getProps,
        getQuestions,
        initQuestions
    }
}