import Header from "../../src/components/Header";

export default function Example() {
  return (
    <div className="bg-gray-900 w-full">
      <Header />
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden">
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
            />
          </svg>
          <div
            className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
            aria-hidden="true"
          >
            <div
              className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 sm:pb-24 lg:flex lg:px-8 lg:pt-40">
            <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
              <img
                className="h-11"
                src="/BC-logo-white.png"
                alt="Your Company"
              />

              <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Blockcestry
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                In addition to providing a secure and decentralized platform for
                creating and managing family trees, "BlockCestry" also supports
                the inclusion of media files to enrich the family history
                experience.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  Get started
                </a>
              </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <img
                  src="/BC-logo-white.png"
                  alt="App screenshot"
                  // width={2432}
                  width={1702}
                  height={1009}
                  className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="mx-auto max-w-7xl px-6 sm:mt-16 lg:px-8 mb-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-white">
            sponsors integrated for SuperHack by ETH Global.
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {/* WORLDCOIN */}
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="https://miro.medium.com/v2/resize:fit:1322/1*ZoSzTptjwtCYVOWOp-aqdg.png"
              alt="Transistor"
              width={158}
              height={48}
            />
            {/* CHAINLINK */}
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chainlink_Logo_Blue.svg/1200px-Chainlink_Logo_Blue.svg.png"
              alt="Reform"
              width={158}
              height={48}
            />
            {/* SAFE */}
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="https://raw.githubusercontent.com/safe-global/safe-react-apps/main/assets/logo.png"
              alt="Tuple"
              width={158}
              height={48}
            />
            {/* ETHEREUM ATTESTATION SERVICE */}
            <img
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="https://storage.googleapis.com/ethglobal-api-production/organizations%2F992b8%2Fimages%2Feas-logo-text.svg"
              alt="SavvyCal"
              width={158}
              height={48}
            />
            {/* ZORA */}
            <img
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="https://www.financebrokerage.com/wp-content/uploads/2022/03/og-image.png"
              alt="Statamic"
              width={158}
              height={48}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer aria-labelledby="footer-heading" className="relative">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
          <div className="border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
            <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
              &copy; 2023 Blockcestry - for SuperHack by Eth Global.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
