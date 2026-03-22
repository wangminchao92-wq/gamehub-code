// 错误监控脚本
console.log('🔍 GameHub 错误监控启动');
console.log('='.repeat(50));

// 监听全局错误
window.addEventListener('error', function(event) {
  console.error('📛 全局错误:', event.error);
  console.error('📛 错误文件:', event.filename);
  console.error('📛 错误行号:', event.lineno);
  console.error('📛 错误列号:', event.colno);
});

// 监听未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(event) {
  console.error('📛 未处理的Promise拒绝:', event.reason);
});

// 监听fetch错误
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args)
    .then(response => {
      if (!response.ok) {
        console.error('📛 Fetch错误:', {
          url: args[0],
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      }
      return response;
    })
    .catch(error => {
      console.error('📛 Fetch捕获错误:', {
        url: args[0],
        error: error.message
      });
      throw error;
    });
};

// 监听XMLHttpRequest错误
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(...args) {
  this._url = args[1];
  return originalXHROpen.apply(this, args);
};

XMLHttpRequest.prototype.send = function(...args) {
  this.addEventListener('error', function() {
    console.error('📛 XMLHttpRequest错误:', {
      url: this._url,
      status: this.status,
      statusText: this.statusText
    });
  });
  
  this.addEventListener('load', function() {
    if (this.status >= 400) {
      console.error('📛 XMLHttpRequest 400+错误:', {
        url: this._url,
        status: this.status,
        statusText: this.statusText
      });
    }
  });
  
  return originalXHRSend.apply(this, args);
};

console.log('✅ 错误监控已启用');
console.log('💡 现在请操作界面，查看控制台输出的具体错误信息');
console.log('='.repeat(50));