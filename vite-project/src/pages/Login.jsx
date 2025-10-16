import React, { useState } from 'react';

const Login = () => {
    // Estados para armazenar e-mail e senha
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Função para lidar com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de autenticação viria aqui (ex: enviar para API)
        console.log('Tentativa de login:', { email, password });
        alert('Tentativa de Login efetuada! Verifique o console para os dados.');
    };

    return (
        // Layout principal: Tela cheia, fundo escuro para ambiente Admin
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            
            {/* Cartão de Login */}
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
                
                {/* Cabeçalho */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Admin Login
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Acesse o painel de administração
                    </p>
                </div>

                {/* Formulário */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Campo E-mail */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                E-mail
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="E-mail de Administrador"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Opções (Lembrar-me e Esqueci a Senha) */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Lembrar-me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    {/* Botão de Login */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {/* Ícone de cadeado (opcional - você pode usar um ícone SVG aqui) */}
                                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;