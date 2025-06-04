import ModelViewer from './components/ModelViewer.tsx';
import { NavBar } from './components/NavBar.tsx';

function App() {
  const objectsToPaint = [
    { name: 'mesh_0', color: '#ff991f' },
    { name: 'mesh_1', color: '#ff991f' },
    { name: 'mesh_2', color: '#ff991f' },
    { name: 'mesh_3', color: '#ff991f' },
    { name: 'mesh_4', color: '#ff991f' },
    { name: 'ALLMESH', color: '#A96200' },
  ];

  return (
    <>
      <NavBar />
      {/* Fixed left side with house model */}
      <div className="fixed left-0 top-0 w-1/2 h-screen bg-gray-100">
        <div className="w-full h-full">
          <ModelViewer objectsToPaint={[]} objToDisplay='/low_poly_house.glb' />
        </div>
      </div>
      {/* Scrollable right side with logo, button, and content */}
      <div className="ml-[50%] bg-[#593400] text-white min-h-screen">
        <div className="p-8 flex flex-col items-center">
          {/* Logo */}
          <div className="w-48 h-48">
            <ModelViewer objectsToPaint={objectsToPaint} objToDisplay='/logo.gltf' />
          </div>
          {/* Schedule Call button */}
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-[#ff991f] mt-6 font-semibold">
            Schedule Call
          </button>
        </div>
        {/* Scrollable content sections */}
        <section className="p-8 bg-opacity-10 bg-white">
          <h2 className="text-3xl font-bold mb-4"> Harness the Power of the Sun </h2>
          <p className="text-lg">
            Discover how solar energy can transform your home with sustainable, cost-effective power.
          </p>
        </section>
        <section className="p-8">
          <h2 className="text-3xl font-bold mb-4"> Why Choose Us? </h2>
          <p className="text-lg">
            We provide top-tier solar solutions tailored to your needs, backed by years of expertise and a commitment to excellence.
          </p>
        </section>
        <section className="p-8 bg-opacity-10 bg-white">
          <h2 className="text-3xl font-bold mb-4"> Our Services </h2>
          <p className="text-lg">
            From consultation to installation and maintenance, we’re your one-stop shop for all things solar.
          </p>
        </section>
        {/* Add more sections as needed */}
      </div>
    </>
  );
}

export default App;