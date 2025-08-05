import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';

interface Product {
    id: number;
    article: string;
    name: string;
    price: number;
    quantity: number;
}

const API_URL = "http://localhost:4000/products";

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Состояние для формы
    const [name, setName] = useState('');
    const [article, setArticle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    
    // Состояние для редактирования
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editName, setEditName] = useState('');
    const [editArticle, setEditArticle] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editQuantity, setEditQuantity] = useState('');

    const fetchProducts = async (currentPage: number) => {
        try {
            const response = await axios.get(`${API_URL}?page=${currentPage}&limit=10`);
            setProducts(response.data.data);
            setTotalPages(Math.ceil(response.data.total / 10));
        } catch (e) {
            console.error("Failed to fetch products", e);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Вы уверены?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchProducts(page);
            } catch (e) {
                console.error("Failed to delete product", e);
            }
        }
    };
  
    const handleUpdate = async (id: number) => {
        try {
        const response = await axios.put(`${API_URL}/${id}`, {
            name: editName,
            article: editArticle,
            price: Number(editPrice),
            quantity: Number(editQuantity)
        });

        console.log(response)
        
        fetchProducts(page);
        
        // Сбрасываем состояние редактирования
        setEditingProduct(null);
        setEditName('');
        setEditArticle('');
        setEditPrice('');
        setEditQuantity('');
        setError('');
        } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка при обновлении');
        }
    };

    const startEdit = (product: Product) => {
        setEditingProduct(product);
        setEditName(product.name);
        setEditArticle(product.article);
        setEditPrice(product.price.toString());
        setEditQuantity(product.quantity.toString());
        setError('');
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setEditName('');
        setEditArticle('');
        setEditPrice('');
        setEditQuantity('');
        setError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(API_URL, {
                name,
                article,
                price: Number(price),
                quantity: Number(quantity)
            });
            // Сброс формы и обновление
            setName('');
            setArticle('');
            setPrice('');
            setQuantity('');
            fetchProducts(page);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при добавлении');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto p-6 max-w-7xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Учет товаров</h1>
                    <p className="text-gray-600">Система управления товарами Smart Mill Service</p>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">➕</span>
                        Добавить товар
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input 
                            type="text" 
                            placeholder="Название товара" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Артикул" 
                            value={article} 
                            onChange={e => setArticle(e.target.value)} 
                            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Цена" 
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            min="1" 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Количество" 
                            value={quantity} 
                            onChange={e => setQuantity(e.target.value)} 
                            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            min="0" 
                            required 
                        />
                        <button 
                            type="submit" 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
                        >
                            Добавить
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-3 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
                </div>

                {editingProduct && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl mb-8 border border-yellow-200 shadow-lg">
                        <h3 className="text-lg font-semibold mb-3 text-yellow-800 flex items-center">
                            <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">✏️</span>
                            Редактирование товара #{editingProduct.id}
                        </h3>
                        <p className="text-sm text-yellow-700 mb-3">Измените данные и нажмите ✅ для сохранения или ❌ для отмены</p>
                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">📋</span>
                            Список товаров
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Артикул</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingProduct?.id === p.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editName} 
                                                    onChange={e => setEditName(e.target.value)} 
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                p.name
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingProduct?.id === p.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editArticle} 
                                                    onChange={e => setEditArticle(e.target.value)} 
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                p.article
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingProduct?.id === p.id ? (
                                                <input 
                                                    type="number" 
                                                    value={editPrice} 
                                                    onChange={e => setEditPrice(e.target.value)} 
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="1"
                                                />
                                            ) : (
                                                <span className="font-medium text-green-600">₽{p.price}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingProduct?.id === p.id ? (
                                                <input 
                                                    type="number" 
                                                    value={editQuantity} 
                                                    onChange={e => setEditQuantity(e.target.value)} 
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                />
                                            ) : (
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    p.quantity > 10 ? 'bg-green-100 text-green-800' : 
                                                    p.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {p.quantity} шт.
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingProduct?.id === p.id ? (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleUpdate(p.id)} 
                                                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                                                        title="Сохранить"
                                                    >
                                                        ✅
                                                    </button>
                                                    <button 
                                                        onClick={cancelEdit} 
                                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                        title="Отменить"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => startEdit(p)} 
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                                        title="Редактировать"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id)} 
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                                        title="Удалить"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center">
                    <button 
                        onClick={() => setPage(p => p - 1)} 
                        disabled={page <= 1} 
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mr-4"
                    >
                        ← Назад
                    </button>
                    <span className="text-gray-600 font-medium">Страница {page} из {totalPages}</span>
                    <button 
                        onClick={() => setPage(p => p + 1)} 
                        disabled={page >= totalPages} 
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ml-4"
                    >
                        Вперед →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;