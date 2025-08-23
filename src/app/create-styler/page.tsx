'use client';

import React, { useState, useEffect } from 'react';

export default function CreateStylerPage() {
  const [connected, setConnected] = useState(false);
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [params, setParams] = useState('{}');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCreations, setActiveCreations] = useState([]);

  useEffect(() => {
    checkConnection();
    loadTools();
    loadActiveCreations();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:4000/health');
      const data = await response.json();
      setConnected(data.status === 'operational');
    } catch (error) {
      setConnected(false);
    }
  };

  const loadTools = async () => {
    try {
      const response = await fetch('http://localhost:4000/tools');
      const toolsData = await response.json();
      setTools(toolsData);
    } catch (error) {
      console.error('Failed to load tools:', error);
    }
  };

  const loadActiveCreations = async () => {
    try {
      const response = await fetch('http://localhost:4000/creations');
      const creations = await response.json();
      setActiveCreations(creations);
    } catch (error) {
      console.error('Failed to load active creations:', error);
    }
  };

  const executeTool = async () => {
    if (!selectedTool) return;
    
    setLoading(true);
    setResult('');
    
    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(params);
      } catch (e) {
        setResult('Invalid JSON parameters');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:4000/tools/${selectedTool}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedParams)
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      loadActiveCreations();
    }
  };

  const createWorkflow = async (workflowName: string, workflowParams: any) => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:4000/workflow/${workflowName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowParams)
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      loadActiveCreations();
    }
  };

  const toolCategories = tools.reduce((acc: any, tool: any) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🚀 /CREATE STYLER MCP SERVER
              </h1>
              <p className="text-xl text-gray-600">
                Transform every local LLM into an omnipotent creator
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="font-semibold">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={checkConnection}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-1">Available Tools</h3>
              <p className="text-2xl font-bold text-blue-600">{tools.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-1">Categories</h3>
              <p className="text-2xl font-bold text-green-600">{Object.keys(toolCategories).length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-1">Active Creations</h3>
              <p className="text-2xl font-bold text-purple-600">{activeCreations.length}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-1">Status</h3>
              <p className="text-2xl font-bold text-orange-600">Ready</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Tool Selection */}
          <div className="col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Available Tools</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(toolCategories).map(([category, categoryTools]: [string, any]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2 capitalize">{category}</h3>
                  <div className="space-y-1">
                    {categoryTools.map((tool: any) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedTool === tool.id
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tool.id.replace('create.', '')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tool Execution */}
          <div className="col-span-2 space-y-8">
            {/* Manual Tool Execution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Execute Tool</h2>
              
              {selectedTool && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Selected Tool:</h3>
                  <p className="text-blue-600">{selectedTool}</p>
                  <p className="text-sm text-blue-500 mt-1">
                    {tools.find((t: any) => t.id === selectedTool)?.description}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parameters (JSON)
                  </label>
                  <textarea
                    value={params}
                    onChange={(e) => setParams(e.target.value)}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder='{"name": "MyApp", "description": "A great app"}'
                  />
                </div>
                
                <button
                  onClick={executeTool}
                  disabled={!selectedTool || loading}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {loading ? 'Executing...' : 'Execute Tool'}
                </button>
              </div>
            </div>

            {/* Quick Workflows */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Workflows</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => createWorkflow('startup', { 
                    idea: 'AI-powered social platform',
                    mvp: true 
                  })}
                  disabled={loading}
                  className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg text-left transition-colors disabled:opacity-50"
                >
                  <h3 className="font-semibold text-purple-800 mb-1">10-Minute Startup</h3>
                  <p className="text-sm text-purple-600">Create complete startup</p>
                </button>
                
                <button
                  onClick={() => createWorkflow('pivot', { 
                    current: 'B2C app',
                    target: 'B2B SaaS' 
                  })}
                  disabled={loading}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-left transition-colors disabled:opacity-50"
                >
                  <h3 className="font-semibold text-blue-800 mb-1">Instant Pivot</h3>
                  <p className="text-sm text-blue-600">Transform business model</p>
                </button>
                
                <button
                  onClick={() => createWorkflow('clone', { 
                    source: 'Instagram',
                    adaptations: ['books', 'reading'] 
                  })}
                  disabled={loading}
                  className="p-4 bg-green-100 hover:bg-green-200 rounded-lg text-left transition-colors disabled:opacity-50"
                >
                  <h3 className="font-semibold text-green-800 mb-1">App Cloner</h3>
                  <p className="text-sm text-green-600">Clone and adapt apps</p>
                </button>
                
                <button
                  onClick={() => executeTool()}
                  disabled={loading}
                  className="p-4 bg-orange-100 hover:bg-orange-200 rounded-lg text-left transition-colors disabled:opacity-50"
                >
                  <h3 className="font-semibold text-orange-800 mb-1">Content Factory</h3>
                  <p className="text-sm text-orange-600">Generate content at scale</p>
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Result</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {result}
                </pre>
              </div>
            )}

            {/* Active Creations */}
            {activeCreations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🔄 Active Creations</h2>
                <div className="space-y-3">
                  {activeCreations.map((creation: any) => (
                    <div key={creation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{creation.id}</p>
                        <p className="text-sm text-gray-600">Type: {creation.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          creation.status === 'complete' 
                            ? 'bg-green-100 text-green-800'
                            : creation.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {creation.status}
                        </span>
                        {creation.duration && (
                          <span className="text-sm text-gray-500">
                            {Math.round(creation.duration / 1000)}s
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}