import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// URL base da sua API
const API_BASE_URL = 'https://catalogo-06.onrender.com/api/items';

// =======================
// Função Utilitária para Conversão Base64
// =======================
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(''); // Retorna string vazia se nenhum arquivo for fornecido
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};


// =======================
// Componente Principal
// =======================
const AdminPage = () => {
    // ESTADO DE AUTENTICAÇÃO
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // ESTADO DO PAINEL ADMIN
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); 

    // CREDENCIAIS FIXAS PARA VALIDAÇÃO NO FRONT-END
    const VALID_EMAIL = 'lucas@admin.com';
    const VALID_PASSWORD = '1981Abcd'; 

    // Lógica de Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoginError('');

        if (loginEmail === VALID_EMAIL && loginPassword === VALID_PASSWORD) {
            setIsLoggedIn(true);
        } else {
            setLoginError('Credenciais inválidas. Por favor, tente novamente.');
        }
    };
    
    // Lógica de Logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
        setProducts([]); // Limpa dados do admin
    };

    // Lógica de Fetching (só deve ser chamada se estiver logado)
    const fetchProducts = () => {
        setIsLoading(true);
        setError(null);
        axios.get(API_BASE_URL)
            .then((response) => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao buscar itens:', err);
                setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
        }
    }, [isLoggedIn]);

    // Funções de CRUD (inalteradas, mas só são usadas no painel)
    const handleAddProduct = () => {
        setIsAddModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product); // Define o produto a ser editado
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            axios.delete(`${API_BASE_URL}/${productId}`)
                .then(() => {
                    alert('Produto deletado com sucesso!');
                    fetchProducts();
                })
                .catch((err) => {
                    console.error('Erro ao deletar produto:', err);
                    alert('Erro ao deletar produto. Verifique o console.');
                });
        }
    };

    // ===================================
    // 1. TELA DE LOGIN (EMBUTIDA)
    // ===================================
    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900">Acesso Administrativo</h2>
                    
                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <p className="block sm:inline text-sm">{loginError}</p>
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ===================================
    // 2. PAINEL ADMINISTRATIVO (APÓS LOGIN)
    // ===================================

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Carregando produtos...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-8 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b-4 border-indigo-600 pb-2">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Painel de Administração de Produtos
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 ease-in-out"
                >
                    Sair
                </button>
            </div>


            <div className="flex justify-end mb-6">
                <button
                    onClick={handleAddProduct}
                    className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                >
                    <span className="text-xl mr-2">+</span> Adicionar Novo Produto
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length === 0 ? (
                    <p className="col-span-full text-center text-lg text-gray-600">Nenhum produto cadastrado.</p>
                ) : (
                    products.map((product) => (
                        <ProductAdminCard
                            key={product._id || product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))
                )}
            </div>

            {isAddModalOpen && (
                <AddProductModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={fetchProducts}
                />
            )}

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSuccess={fetchProducts} 
                />
            )}
        </div>
    );
};

// ------------------------------------------------------------------
// Subcomponente Card de Produto no Admin (Inalterado)
// ------------------------------------------------------------------
const ProductAdminCard = ({ product, onEdit, onDelete }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const variants = product.variants || [];

    useEffect(() => {
        if (variants.length > 1) { 
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % variants.length);
            }, 3000); 
            return () => clearInterval(interval);
        }
    }, [variants]);

    const currentImage = variants.length > 0
        ? variants[currentImageIndex].image
        : product.imageString;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100 relative">
                {currentImage ? (
                    <img
                        src={currentImage} 
                        alt={product.productName}
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    />
                ) : (
                    <div className="text-gray-400 text-5xl">📦</div> 
                )}
            </div>

            <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">{product.productName}</h2>
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Preço:</span> R$ {Number(product.price).toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                     <span className="font-semibold">Categoria:</span> {product.category || 'N/A'}
                </p>
                {variants.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <span className="mr-1 text-indigo-500">◻️</span>
                        <span className="font-semibold">Variantes:</span> {variants.length}
                    </p>
                )}
                
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-150 text-sm"
                        title="Editar"
                    >
                        📝
                    </button>
                    <button
                        onClick={() => onDelete(product._id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150 text-sm"
                        title="Deletar"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};


// ------------------------------------------------------------------
// Subcomponente Modal de Adicionar Produto (Com Base64)
// ------------------------------------------------------------------
const AddProductModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        description: '',
        imageString: '', 
        category: '', 
    });
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState([{ title: '', image: '' }]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        try {
            const base64 = await fileToBase64(file);
            setFormData((prev) => ({ ...prev, imageString: base64 }));
        } catch (error) {
            console.error("Erro ao converter arquivo para Base64:", error);
            alert("Erro ao carregar a imagem. Tente novamente.");
            setFormData((prev) => ({ ...prev, imageString: '' }));
        }
    };

    const handleVariantFileChange = async (index, file) => {
        try {
            const base64 = await fileToBase64(file);
            const newVariants = [...variants];
            newVariants[index].image = base64;
            setVariants(newVariants);
        } catch (error) {
            console.error("Erro ao converter arquivo da variante para Base64:", error);
            alert("Erro ao carregar a imagem da variante. Tente novamente.");
        }
    };

    const handleVariantTextChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };


    const addVariant = () => {
        setVariants((prev) => [...prev, { title: '', image: '' }]);
    };

    const removeVariant = (index) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            productName: formData.productName,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category, 
        };

        if (hasVariants) {
            const validVariants = variants.filter(v => v.title.trim() !== '' && v.image.trim() !== '');
            if (validVariants.length === 0) {
                alert('Adicione pelo menos uma variante válida ou desmarque "Possui Variantes".');
                return;
            }
            dataToSubmit.variants = validVariants;

        } else {
            if (!formData.imageString) {
                alert('Por favor, adicione uma imagem para o produto.');
                return;
            }
            dataToSubmit.imageString = formData.imageString;
        }
        
        axios.post(`${API_BASE_URL}`, dataToSubmit) 
            .then(() => {
                alert('Produto adicionado com sucesso!');
                onSuccess();
                onClose();
            })
            .catch((err) => {
                console.error('Erro ao adicionar produto:', err.response?.data || err.message);
                alert(`Erro ao adicionar produto: ${err.response?.data?.error || 'Verifique o console para mais detalhes.'}`);
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg shadow-xl p-8 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-3xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Adicionar Novo Produto</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                        <input
                            type="text"
                            name="productName"
                            id="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria (category)</label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="hasVariants"
                            checked={hasVariants}
                            onChange={(e) => setHasVariants(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="hasVariants" className="ml-2 block text-sm text-gray-900">
                            Possui Variantes (ex: cores, tamanhos)
                        </label>
                    </div>

                    {!hasVariants ? (
                        <div>
                            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Imagem Principal (Base64)</label>
                            <input
                                type="file" 
                                name="imageFile"
                                id="imageFile"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                required={!hasVariants}
                            />
                            {formData.imageString && (
                                <img src={formData.imageString} alt="Pré-visualização" className="mt-2 h-20 w-20 object-cover rounded-md border" />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">Variantes</h3>
                            {variants.map((variant, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 items-center p-3 border rounded-md bg-white shadow-sm">
                                    <div className="flex-grow w-full md:w-auto">
                                        <label htmlFor={`variant-title-${index}`} className="block text-xs font-medium text-gray-600">Título da Variante</label>
                                        <input
                                            type="text"
                                            id={`variant-title-${index}`}
                                            value={variant.title}
                                            onChange={(e) => handleVariantTextChange(index, 'title', e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                                            placeholder="Ex: Azul, Tamanho M"
                                            required
                                        />
                                    </div>
                                    <div className="flex-grow w-full md:w-auto">
                                        <label htmlFor={`variant-image-${index}`} className="block text-xs font-medium text-gray-600">Imagem da Variante (Base64)</label>
                                        <input
                                            type="file" 
                                            id={`variant-image-${index}`}
                                            accept="image/*"
                                            onChange={(e) => handleVariantFileChange(index, e.target.files[0])}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                            required
                                        />
                                        {variant.image && (
                                            <img src={variant.image} alt="Pré-visualização" className="mt-1 h-10 w-10 object-cover rounded-md border" />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="mt-4 md:mt-0 p-2 text-red-600 hover:text-red-800 text-lg"
                                        title="Remover variante"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150"
                            >
                                <span className="mr-2">+</span> Adicionar Outra Variante
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
                        >
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ------------------------------------------------------------------
// Subcomponente Modal de Edição de Produto (Com Base64)
// ------------------------------------------------------------------
const EditProductModal = ({ product, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        productName: product.productName || '',
        price: product.price || '',
        description: product.description || '',
        imageString: product.imageString || '', 
        category: product.category || '',
    });
    const [hasVariants, setHasVariants] = useState(!!product.variants && product.variants.length > 0);
    const [variants, setVariants] = useState(
        product.variants && product.variants.length > 0 
        ? product.variants 
        : [{ title: '', image: '' }]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        try {
            const base64 = await fileToBase64(file);
            setFormData((prev) => ({ ...prev, imageString: base64 }));
        } catch (error) {
            console.error("Erro ao converter arquivo para Base64:", error);
            alert("Erro ao carregar a imagem. Tente novamente.");
        }
    };
    
    const handleVariantFileChange = async (index, file) => {
        try {
            const base64 = await fileToBase64(file);
            const newVariants = [...variants];
            newVariants[index].image = base64;
            setVariants(newVariants);
        } catch (error) {
            console.error("Erro ao converter arquivo da variante para Base64:", error);
            alert("Erro ao carregar a imagem da variante. Tente novamente.");
        }
    };

    const handleVariantTextChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants((prev) => [...prev, { title: '', image: '' }]);
    };

    const removeVariant = (index) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const dataToSubmit = {
            productName: formData.productName,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
        };

        if (hasVariants) {
            const validVariants = variants.filter(v => v.title.trim() !== '' && v.image.trim() !== '');
            if (validVariants.length === 0) {
                 alert('Adicione pelo menos uma variante válida ou desmarque "Possui Variantes".');
                 return;
            }
            dataToSubmit.variants = validVariants;
            dataToSubmit.imageString = undefined; 

        } else {
            if (!formData.imageString) {
                alert('Por favor, adicione uma imagem para o produto.');
                return;
            }
            dataToSubmit.imageString = formData.imageString;
            dataToSubmit.variants = undefined; 
        }

        try {
            await axios.put(`${API_BASE_URL}/${product._id}`, dataToSubmit);

            alert(`Produto "${formData.productName}" atualizado com sucesso!`);
            onSuccess();
            onClose();

        } catch (error) {
            console.error('Erro ao atualizar produto:', error.response?.data || error.message);
            alert(`Erro ao atualizar produto: ${error.response?.data?.error || 'Verifique o console para detalhes.'}`);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg shadow-xl p-8 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-3xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Editar Produto: {product.productName}</h2>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="edit-productName" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                        <input
                            type="text"
                            name="productName"
                            id="edit-productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                        <input
                            type="number"
                            name="price"
                            id="edit-price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            name="description"
                            id="edit-description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Categoria</label>
                        <input
                            type="text"
                            name="category"
                            id="edit-category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="edit-hasVariants"
                            checked={hasVariants}
                            onChange={(e) => setHasVariants(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="edit-hasVariants" className="ml-2 block text-sm text-gray-900">
                            Possui Variantes (ex: cores, tamanhos)
                        </label>
                    </div>

                    {!hasVariants ? (
                        <div>
                            <label htmlFor="edit-imageFile" className="block text-sm font-medium text-gray-700">Imagem Principal (Base64)</label>
                            <input
                                type="file" 
                                name="imageFile"
                                id="edit-imageFile"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {formData.imageString && (
                                <>
                                    <p className="mt-2 text-xs text-gray-500">Imagem Atual:</p>
                                    <img src={formData.imageString} alt="Pré-visualização" className="mt-1 h-20 w-20 object-cover rounded-md border" />
                                </>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Selecione um novo arquivo para substituir a imagem atual (URL ou Base64).</p>
                        </div>
                    ) : (
                        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">Variantes</h3>
                            {variants.map((variant, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 items-center p-3 border rounded-md bg-white shadow-sm">
                                    <div className="flex-grow w-full md:w-auto">
                                        <label htmlFor={`edit-variant-title-${index}`} className="block text-xs font-medium text-gray-600">Título da Variante</label>
                                        <input
                                            type="text"
                                            id={`edit-variant-title-${index}`}
                                            value={variant.title}
                                            onChange={(e) => handleVariantTextChange(index, 'title', e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                                            placeholder="Ex: Azul, Tamanho M"
                                            required
                                        />
                                    </div>
                                    <div className="flex-grow w-full md:w-auto">
                                        <label htmlFor={`edit-variant-image-${index}`} className="block text-xs font-medium text-gray-600">Imagem da Variante (Base64)</label>
                                        <input
                                            type="file" 
                                            id={`edit-variant-image-${index}`}
                                            accept="image/*"
                                            onChange={(e) => handleVariantFileChange(index, e.target.files[0])}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                        {variant.image && (
                                            <img src={variant.image} alt="Pré-visualização" className="mt-1 h-10 w-10 object-cover rounded-md border" />
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">Selecione um novo arquivo para substituir a imagem atual.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="mt-4 md:mt-0 p-2 text-red-600 hover:text-red-800 text-lg"
                                        title="Remover variante"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150"
                            >
                                <span className="mr-2">+</span> Adicionar Outra Variante
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;