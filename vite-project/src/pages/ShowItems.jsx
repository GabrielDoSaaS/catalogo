import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Defina seu número de WhatsApp com código de país (ex: 55 para Brasil + DDD + número)
const WHATSAPP_NUMBER = "19983791236"; 

// =======================
// Componente Principal
// =======================
const ShowItems = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Estados para busca e filtro
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        axios.get('https://catalogo-06.onrender.com/api/items')
            .then((response) => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao buscar itens:', err);
                setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
                setIsLoading(false);
            });
    }, []);

    // Lógica para extrair categorias únicas
    const uniqueCategories = useMemo(() => {
        const categories = products
            .map(p => p.category)
            .filter(c => c && typeof c === 'string');
        
        const unique = [...new Set(categories)]; 
        
        return ['Todos', ...unique];
    }, [products]);

    // Lógica para filtrar produtos
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const productName = product.productName.toLowerCase();
            const description = product.description ? product.description.toLowerCase() : '';
            const category = product.category ? product.category.toLowerCase() : '';

            const matchesSearch = productName.includes(lowerSearchTerm) ||
                                  description.includes(lowerSearchTerm) ||
                                  category.includes(lowerSearchTerm);
            
            const matchesCategory = selectedCategory === 'Todos' || 
                                   (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-indigo-600">Carregando produtos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen">
                <h1 className="text-4xl font-extrabold text-red-600 mb-4">Erro de Carregamento</h1>
                <p className="text-lg text-gray-700">{error}</p>
                <p className="text-md text-gray-500 mt-2">Verifique a conexão com a API.</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Catálogo Vazio</h1>
                <p className="text-lg text-gray-700">Não há produtos para exibir no momento.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen relative">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center border-b-4 border-indigo-600 pb-2">
                Bellavine
            </h1>

            {/* Área de Busca e Filtro */}
            <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                
                {/* Campo de Pesquisa */}
                <input
                    type="text"
                    placeholder="Buscar por nome, descrição ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                
                {/* Filtro de Categoria */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-auto md:max-w-[200px] p-3 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150 cursor-pointer text-gray-700"
                >
                    {uniqueCategories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.length === 0 ? (
                    <p className="col-span-full text-center text-lg text-gray-600 p-8">Nenhum produto encontrado com os filtros aplicados. Tente ajustar a busca ou a categoria.</p>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id || product.id}
                            product={product}
                            onSelect={() => setSelectedProduct(product)}
                        />
                    ))
                )}
            </div>

            <div className="mt-12 pt-6 text-center text-gray-500 text-sm border-t">
                Fim do Catálogo - {filteredProducts.length} itens exibidos (Total: {products.length}).
            </div>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    whatsappNumber={WHATSAPP_NUMBER} // Passa o número para o modal
                />
            )}
        </div>
    );
};

// =======================
// Card de Produto (Inalterado)
// =======================
const ProductCard = ({ product, onSelect }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const variants = product.variants || [];

    useEffect(() => {
        if (variants.length > 0) {
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
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out border-t-4 border-indigo-500">
            <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-200 relative">
                <div
                    key={currentImageIndex}
                    className="absolute w-full h-full transition-transform duration-700 ease-in-out transform"
                    style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        animation: 'slideIn 0.7s ease-in-out',
                    }}
                ></div>
            </div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{product.productName}</h2>

                <p className="text-3xl font-extrabold text-indigo-600 mb-6">
                    R$ {Number(product.price).toFixed(2).replace('.', ',')}
                </p>

                <button
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                    onClick={onSelect}
                >
                    Escolher
                </button>
            </div>
        </div>
    );
};

// =======================
// Modal de Produto (Atualizado com campos de cliente)
// =======================
const ProductModal = ({ product, onClose, whatsappNumber }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantities, setQuantities] = useState({});
    
    // NOVOS ESTADOS PARA DADOS DO CLIENTE
    const [clientName, setClientName] = useState('');
    const [clientCEP, setClientCEP] = useState('');
    const [clientAddress, setClientAddress] = useState('');

    const variants = product.variants || [];

    useEffect(() => {
        if (variants.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % variants.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [variants]);

    const currentImage = variants.length > 0
        ? variants[currentImageIndex].image
        : product.imageString;

    const handleQuantityChange = (key, value) => {
        setQuantities((prev) => ({
            ...prev,
            [key]: Math.max(0, parseInt(value) || 0),
        }));
    };

    const handleConfirmSelection = () => {
        let totalQuantity = 0;
        let totalValue = 0;
        let messageDetails = [];

        // 1. Coleta e Valida Quantidades
        if (variants.length > 0) {
            variants.forEach((v) => {
                const quantity = quantities[v.title] || 0;
                if (quantity > 0) {
                    messageDetails.push(`- ${quantity}x ${v.title}`);
                    totalQuantity += quantity;
                    totalValue += quantity * product.price;
                }
            });
        } else {
            const quantity = quantities.general || 0;
            if (quantity > 0) {
                messageDetails.push(`- ${quantity}x Item Único`);
                totalQuantity = quantity;
                totalValue = quantity * product.price;
            }
        }

        if (totalQuantity === 0) {
            alert('Por favor, selecione pelo menos uma quantidade.');
            return;
        }

        // 2. Valida Dados do Cliente
        if (!clientName.trim() || !clientCEP.trim() || !clientAddress.trim()) {
            alert('Por favor, preencha seu Nome, CEP e Endereço para finalizar o pedido.');
            return;
        }

        // 3. Construção da Mensagem do WhatsApp
        const formattedPrice = Number(product.price).toFixed(2).replace('.', ',');
        const formattedTotal = totalValue.toFixed(2).replace('.', ',');
        const detailsString = messageDetails.join('\n');
        
        const message = encodeURIComponent(
            `*--- NOVO PEDIDO ---*\n\n` +
            `*Cliente:* ${clientName.trim()}\n` +
            `*CEP:* ${clientCEP.trim()}\n` +
            `*Endereço:* ${clientAddress.trim()}\n\n` +
            `*--- DETALHES DO PRODUTO ---*\n` +
            `*Produto:* ${product.productName}\n` +
            `*Categoria:* ${product.category || 'N/A'}\n` +
            `*Preço Unitário:* R$ ${formattedPrice}\n\n` +
            `*Itens Selecionados:*\n` +
            `${detailsString}\n\n` +
            `*Total do Pedido:* R$ ${formattedTotal}\n` +
            `Aguardando confirmação de pagamento e envio.`
        );

        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

        // 4. Redirecionamento
        window.open(whatsappURL, '_blank');
        onClose();
    };

    const totalOrderValue = useMemo(() => {
        let total = 0;
        if (variants.length > 0) {
            variants.forEach(v => {
                const quantity = quantities[v.title] || 0;
                total += quantity * product.price;
            });
        } else {
            total = (quantities.general || 0) * product.price;
        }
        return total.toFixed(2).replace('.', ',');
    }, [quantities, variants, product.price]);


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
            {/* Fundo clicável semi-transparente */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-h-[90vh] overflow-y-auto">
                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
                >
                    ×
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Coluna 1: Imagem e Informações do Produto */}
                    <div className="pr-4 border-r md:border-r-0">
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img
                                src={currentImage}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h2>
                        <p className="text-sm text-gray-500 mb-4">Categoria: {product.category || 'N/A'}</p>
                        <p className="text-3xl font-extrabold text-indigo-600 mb-6">
                            R$ {Number(product.price).toFixed(2).replace('.', ',')} (cada)
                        </p>
                    </div>

                    {/* Coluna 2: Quantidade e Dados do Cliente */}
                    <div>
                        {/* Seção de Quantidade/Variantes */}
                        <div className="mb-6 pb-4 border-b">
                            <h3 className="font-bold text-lg text-gray-800 mb-3">1. Selecione a Quantidade</h3>
                            
                            {variants.length > 0 ? (
                                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                    {variants.map((v, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-gray-700 font-medium">{v.title}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={quantities[v.title] || ''}
                                                onChange={(e) => handleQuantityChange(v.title, e.target.value)}
                                                className="w-20 p-2 border rounded-md text-center focus:ring-indigo-500"
                                                placeholder="0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <label className="text-gray-700 font-medium">Quantidade:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantities.general || ''}
                                        onChange={(e) => handleQuantityChange('general', e.target.value)}
                                        className="w-24 p-2 ml-3 border rounded-md text-center focus:ring-indigo-500"
                                        placeholder="0"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Seção de Dados do Cliente */}
                        <div className="mb-6 pb-4 border-b">
                             <h3 className="font-bold text-lg text-gray-800 mb-3">2. Dados para Entrega</h3>
                            
                            <input
                                type="text"
                                placeholder="Seu Nome Completo"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full p-2 mb-2 border rounded-md focus:ring-indigo-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="CEP (ex: 12345-678)"
                                value={clientCEP}
                                onChange={(e) => setClientCEP(e.target.value)}
                                className="w-full p-2 mb-2 border rounded-md focus:ring-indigo-500"
                                required
                            />
                            <textarea
                                placeholder="Endereço Completo (Rua, Número, Bairro, Cidade)"
                                value={clientAddress}
                                onChange={(e) => setClientAddress(e.target.value)}
                                rows="2"
                                className="w-full p-2 border rounded-md focus:ring-indigo-500"
                                required
                            />
                        </div>
                        
                        {/* Seção Total e Botão Final */}
                        <div className="mt-4">
                            <div className="p-3 bg-indigo-50 rounded-lg flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">TOTAL DO PEDIDO:</span>
                                <span className="text-2xl font-extrabold text-indigo-700">R$ {totalOrderValue}</span>
                            </div>

                            <button
                                className="mt-4 w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 flex items-center justify-center space-x-2"
                                onClick={handleConfirmSelection}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 12.5c-.324.004-.648-.008-.973-.036a1.001 1.001 0 01-.892-.55l-.546-1.168a.5.5 0 00-.374-.298l-1.396-.192a.5.5 0 00-.476.136l-1.954 1.954a.5.5 0 01-.354.147l-1.28.006a.5.5 0 01-.482-.363l-.707-1.414a.5.5 0 01.354-.648l1.414-.707a.5.5 0 00.363-.482l.006-1.28a.5.5 0 01.147-.354l1.954-1.954a.5.5 0 00.136-.476l-.192-1.396a1.001 1.001 0 01.55-.892c.325-.028.649-.04 1.258-.04h.024a.5.5 0 01.447.276l.707 1.414a.5.5 0 00.482.363l1.28.006a.5.5 0 01.354.147l1.954 1.954a.5.5 0 00.136.476l-.192 1.396a1.001 1.001 0 01-.55.892l-1.28.707a.5.5 0 00-.363.482l.006 1.28a.5.5 0 01-.147.354l-1.954 1.954a.5.5 0 00-.476.136z" fill="#fff"/></svg>
                                <span>Enviar Pedido (WhatsApp)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =======================
// Animação slide
// =======================
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideIn {
  0% { transform: translateX(100%); opacity: 0.2; }
  100% { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);

export default ShowItems;