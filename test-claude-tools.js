#!/usr/bin/env node

/**
 * Test Script for Claude Tool Integration
 * Tests core functionalities through the MCP bridge
 */

const WebSocket = require('ws');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ClaudeToolTester {
  constructor() {
    this.ws = null;
    this.testResults = [];
    this.currentTest = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('ws://localhost:3002');
      
      this.ws.on('open', () => {
        console.log(`${colors.green}✓ Connected to MCP Bridge${colors.reset}`);
        resolve();
      });
      
      this.ws.on('error', (error) => {
        console.error(`${colors.red}✗ Connection error:${colors.reset}`, error.message);
        reject(error);
      });
      
      this.ws.on('message', (data) => {
        try {
          const response = JSON.parse(data);
          if (this.currentTest) {
            this.currentTest.resolve(response);
          }
        } catch (error) {
          console.error(`${colors.red}Error parsing response:${colors.reset}`, error.message);
        }
      });
    });
  }

  sendCommand(command) {
    return new Promise((resolve) => {
      // Clear any pending test first
      this.currentTest = null;
      
      // Add a small delay to ensure previous response is processed
      setTimeout(() => {
        this.currentTest = { resolve };
        this.ws.send(command);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (this.currentTest) {
            this.currentTest.resolve({ error: 'Timeout' });
            this.currentTest = null;
          }
        }, 5000);
      }, 100); // 100ms delay between commands
    });
  }

  async runTests() {
    console.log(`\n${colors.cyan}🧪 Starting Claude Tool Tests${colors.reset}\n`);
    
    // Test 1: Initialize connection
    console.log(`${colors.blue}Test 1: Initialize Connection${colors.reset}`);
    const initResponse = await this.sendCommand('init');
    this.logResult('Initialize', !initResponse.error);
    
    // Test 2: List tools
    console.log(`\n${colors.blue}Test 2: List Available Tools${colors.reset}`);
    const toolsResponse = await this.sendCommand('/tools');
    const hasTools = toolsResponse.response && toolsResponse.response.includes('Available Claude Tools');
    this.logResult('List Tools', hasTools);
    if (hasTools) {
      console.log(`${colors.cyan}Sample tools found:${colors.reset}`);
      const toolLines = toolsResponse.response.split('\n').slice(2, 7);
      toolLines.forEach(line => console.log(`  ${line}`));
    } else {
      console.log(`${colors.yellow}Response: ${toolsResponse.response ? toolsResponse.response.substring(0, 100) : 'No response'}${colors.reset}`);
    }
    
    // Test 3: MCP servers
    console.log(`\n${colors.blue}Test 3: List MCP Servers${colors.reset}`);
    const mcpResponse = await this.sendCommand('/mcp');
    const hasMCP = mcpResponse.response && mcpResponse.response.includes('Available Claude Tools');
    this.logResult('MCP Servers', hasMCP);
    
    // Test 4: File operations test
    console.log(`\n${colors.blue}Test 4: File Operations (simulated)${colors.reset}`);
    const fileTest = await this.sendCommand('Read file: test.txt');
    const fileOpsWork = fileTest.response && !fileTest.error;
    this.logResult('File Operations', fileOpsWork);
    
    // Test 5: Web search test
    console.log(`\n${colors.blue}Test 5: Web Search Capability${colors.reset}`);
    const searchTest = await this.sendCommand('Search: test query');
    const searchWorks = searchTest.response && !searchTest.error;
    this.logResult('Web Search', searchWorks);
    
    // Test 6: Task agent availability
    console.log(`\n${colors.blue}Test 6: Task Agent System${colors.reset}`);
    const taskTest = await this.sendCommand('Task: test task');
    const taskWorks = taskTest.response && !taskTest.error;
    this.logResult('Task Agent', taskWorks);
    
    // Test 7: Claude-styler MCP
    console.log(`\n${colors.blue}Test 7: Claude-Styler MCP${colors.reset}`);
    const stylerTest = await this.sendCommand('/style');
    const stylerWorks = stylerTest.response && stylerTest.response.includes('style');
    this.logResult('Claude-Styler', stylerWorks);
    if (!stylerWorks) {
      console.log(`${colors.yellow}Response: ${stylerTest.response ? stylerTest.response.substring(0, 100) : 'No response'}${colors.reset}`);
    }
    
    // Print summary
    this.printSummary();
  }
  
  logResult(testName, passed) {
    const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(`  ${status} - ${testName}`);
    this.testResults.push({ name: testName, passed });
  }
  
  printSummary() {
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}📊 Test Summary${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);
    
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    
    const passRate = Math.round((passed / total) * 100);
    const color = passRate >= 80 ? colors.green : passRate >= 50 ? colors.yellow : colors.red;
    console.log(`\n${color}Pass Rate: ${passRate}%${colors.reset}`);
    
    if (failed > 0) {
      console.log(`\n${colors.yellow}Failed Tests:${colors.reset}`);
      this.testResults.filter(r => !r.passed).forEach(r => {
        console.log(`  • ${r.name}`);
      });
    }
    
    // Overall status
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    if (passRate >= 80) {
      console.log(`${colors.green}✅ Core Claude Integration: OPERATIONAL${colors.reset}`);
      console.log(`${colors.green}Ready for Visual Dashboard Implementation!${colors.reset}`);
    } else if (passRate >= 50) {
      console.log(`${colors.yellow}⚠️  Core Claude Integration: PARTIALLY WORKING${colors.reset}`);
      console.log(`${colors.yellow}Some features need attention before proceeding.${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Core Claude Integration: NEEDS FIXES${colors.reset}`);
      console.log(`${colors.red}Major issues detected. Fix before proceeding.${colors.reset}`);
    }
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      console.log(`${colors.cyan}Disconnected from MCP Bridge${colors.reset}`);
    }
  }
}

// Main execution
async function main() {
  const tester = new ClaudeToolTester();
  
  try {
    await tester.connect();
    await tester.runTests();
  } catch (error) {
    console.error(`${colors.red}Test suite failed:${colors.reset}`, error.message);
  } finally {
    tester.disconnect();
    process.exit(0);
  }
}

// Run tests
main().catch(console.error);