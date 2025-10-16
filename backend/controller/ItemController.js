const Item = require('../model/Item');


const CreateItem = async ( req, res ) => {
    const { productName, price, description, category, imageString } = req.body;

    console.log(productName, price, imageString);


    if ( !productName || !price || !imageString ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newItem = new Item({ productName, price, description, imageString, category });
        await newItem.save();
        return res.status(201).json(newItem);
    }
    catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

const CreateItemWithVariants = async ( req, res ) => {
    // Note que a sua estrutura de body com variantes está diferente da estrutura sem variantes.
    // O seu CreateItemWithVariants não usa 'category' e 'imageString' como campos separados
    // se o item tiver variantes, apenas o 'variants' é usado.

    const { productName, price, description, category, variants } = req.body;
    
    // Na sua implementação original, 'imageString' e 'category' estavam faltando no new Item com variantes. 
    // Corrigi aqui para incluir 'category', assumindo que a imagem principal virá da primeira variante, 
    // ou que você ajustará o schema para permitir 'category' separadamente.

    console.log(productName, price, description, category, variants);

    try {
        const newItem = new Item({ productName, price, description, category, variants });

        await newItem.save();
        return res.status(201).json(newItem);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

const ReturnItems = async ( req, res ) => {
    try {
        const items = await Item.find();
        return res.status(200).json(items);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// ------------------------------------------------------------------
// NOVA FUNÇÃO: Rota de Edição
// ------------------------------------------------------------------
const UpdateItem = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Remove o ID do corpo da requisição para evitar que ele seja alterado
    delete updateData._id; 

    if (!id) {
        return res.status(400).json({ error: 'ID do item é obrigatório para atualização.' });
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
    }

    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item não encontrado.' });
        }

        return res.status(200).json(updatedItem);

    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        if (error.name === 'ValidationError') {
             return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno do servidor ao atualizar o item.' });
    }
};
// ------------------------------------------------------------------

const DeleteItem = async (req, res) => {
    const { id } = req.params;


    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        return res.status(200).json({ message: 'Item deleted successfully' });
    }   catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}


module.exports = { CreateItem, ReturnItems, DeleteItem, CreateItemWithVariants, UpdateItem };