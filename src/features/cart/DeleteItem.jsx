import { useDispatch } from 'react-redux'
import Button from '../../ui/Button'
import { deleteCartItem } from './cartSlice'

function DeleteItem({ pizzaId }) {
    const dispatch = useDispatch()

    return (
        <Button type="small" onClick={() => dispatch(deleteCartItem(pizzaId))}>
            Delete
        </Button>
    )
}

export default DeleteItem
