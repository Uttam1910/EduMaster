// src/components/ErrorBoundary.jsx
// import React, { Component } from 'react';

// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null, errorInfo: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     this.setState({ errorInfo });
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="container mx-auto px-4 py-8">
//           <h1 className="text-3xl font-bold mb-6">Something went wrong.</h1>
//           <p className="text-gray-600 mb-4">Please try again later.</p>
//           {this.state.error && <details className="whitespace-pre-wrap">
//             <summary>Error Details</summary>
//             {this.state.error.toString()}
//             <br />
//             {this.state.errorInfo && this.state.errorInfo.componentStack}
//           </details>}
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;
