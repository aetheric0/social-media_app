import { useGetSaved } from '@/hooks/queriesAndMutations';
import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';

const Saved = () => {
  const { data: savedData, isPending: isLoadingSaves } = useGetSaved();
  console.log('Saves Data: ', savedData);
  const saves = savedData?.data.saves;
  console.log('Saves: ', saves);
  
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img 
          src="/assets/icons/save.svg"
          width={36}
          height={36} 
          alt="save"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2> 
      </div>
      {isLoadingSaves && !saves ? (
        <Loader />
      ): (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
        { saves.length === 0 ? (
          <p className="text-light-4">No available posts</p>
        ): (
          <GridPostList posts={saves} showStats={false}/> 
        )}
      </ul>    
      )}
     
    </div>
  )
}

export default Saved;