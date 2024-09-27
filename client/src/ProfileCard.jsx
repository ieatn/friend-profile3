import React from 'react';
import { Box, Typography, Switch, Chip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const ProfileCard = ({ profile, useRealisticPhoto, handleTogglePhoto, isDefaultUser, name }) => {
  const avatarUrl = profile.profile_data.personalInfo.gender === 'Female'
    ? `https://api.dicebear.com/9.x/adventurer/svg?seed=Patches`
    : `https://api.dicebear.com/6.x/micah/svg?seed=${profile.profile_data.personalInfo.name}`;
    
  const realisticPhotoUrl = profile.profile_data.personalInfo.gender === 'Female'
    ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200"
    : "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200";

  const renderInterestItem = (label, value) => {
    if (value && value.length > 0) {
      return (
        <Box className="text-sm flex items-center">
          <Typography variant="subtitle2" component="span" className="font-semibold text-white/80 mr-2">{label}</Typography>
          <Typography component="span" className="text-white">{value}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box className="flex flex-col items-center w-full max-w-lg h-[750px] overflow-y-auto bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white" sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
      {isDefaultUser && (
        <Box className="flex justify-end mb-4 w-full">
          <Typography component="span" className="mr-2 text-sm">Avatar</Typography>
          <Switch
            checked={useRealisticPhoto}
            onChange={handleTogglePhoto}
            color="default"
            size="small"
          />
          <Typography component="span" className="ml-2 text-sm">Realistic</Typography>
        </Box>
      )}
      {isDefaultUser ? (
        <Box
          component="img"
          src={useRealisticPhoto ? realisticPhotoUrl : avatarUrl}
          alt={profile.profile_data.personalInfo.name}
          sx={{
            width: 140,
            height: 140,
            borderRadius: '50%', // Rounded corners
            border: '4px solid white',
            marginBottom: 4,
            objectFit: 'cover',
          }}
          className="mx-auto shadow-lg"
        />
      ) : (
        <Box
          sx={{
            width: 140,
            height: 140,
            borderRadius: '50%', // Rounded corners
            border: '4px solid white',
            marginBottom: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="mx-auto shadow-lg"
        >
          <Typography variant="h4">{name.charAt(0)}</Typography>
        </Box>
      )}
      <Typography variant="h4" component="h2" className="mb-6 font-bold text-center">
        {profile.profile_data.personalInfo.name}
      </Typography>
      
      {profile.profile_data.personalInfo.tagline && (
        <Typography variant="subtitle1" className="mb-4 text-center italic">
          "{profile.profile_data.personalInfo.tagline}"
        </Typography>
      )}
      
      <Box className="space-y-8">
        {/* About Me Section */}
        <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <Typography variant="h6" className="font-bold mb-3">About Me</Typography>
          <Typography>{profile.profile_data.personalInfo.aboutMe}</Typography>
        </Box>

        {/* Personal Info Section */}
        <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <Typography variant="h6" className="font-bold mb-3">Personal Info</Typography>
          {renderInterestItem("Age:", profile.profile_data.personalInfo.age)}
          {renderInterestItem("Location:", profile.profile_data.personalInfo.location)}
          {renderInterestItem("Relationship Status:", profile.profile_data.personalInfo.relationshipStatus)}
          {renderInterestItem("Spiritual/Religious Views:", profile.profile_data.personalInfo.spiritualReligious)}
          {renderInterestItem("Favorite Food:", profile.profile_data.personalInfo.favoriteFood)}
          {renderInterestItem("Favorite Restaurants:", profile.profile_data.personalInfo.favoriteRestaurants)}
          {renderInterestItem("Sports:", profile.profile_data.personalInfo.sports)}
          {renderInterestItem("Accomplishments:", profile.profile_data.personalInfo.accomplishments)}
        </Box>

        {/* Lifestyle Section */}
        <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <Typography variant="h6" className="font-bold mb-3">Lifestyle</Typography>
          {renderInterestItem("Occupation:", profile.profile_data.lifestyle.occupation)}
          {renderInterestItem("Goals:", profile.profile_data.lifestyle.goals)}
          {renderInterestItem("Financial Goals:", profile.profile_data.lifestyle.financialGoals)}
          {renderInterestItem("Favorite Causes:", profile.profile_data.lifestyle.favoriteCauses)}
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-2">Values:</Typography>
            <Box className="flex flex-wrap gap-2">
              {profile.profile_data.lifestyle.values.map((value, idx) => (
                <Chip key={idx} label={value} size="small" className="bg-white/20 text-white backdrop-blur-sm" />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Interests Section */}
        <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <Typography variant="h6" className="font-bold mb-3">Interests</Typography>
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-2">Hobbies:</Typography>
            <Box className="flex flex-wrap gap-2">
              {profile.profile_data.interests.hobbies.map((hobby, idx) => (
                <Chip key={idx} label={hobby} size="small" className="bg-white/20 text-white backdrop-blur-sm" />
              ))}
            </Box>
          </Box>
          {renderInterestItem("Favorite Activities:", profile.profile_data.interests.favoriteActivities.join(', '))}
          {renderInterestItem("Favorite Media:", profile.profile_data.interests.favoriteMedia.join(', '))}
          {renderInterestItem("Favorite TV Shows:", profile.profile_data.interests.favoriteTVShows)}
          {renderInterestItem("Favorite Games:", profile.profile_data.interests.favoriteGames)}
          {renderInterestItem("Favorite Books:", profile.profile_data.interests.favoriteBooks)}
          {renderInterestItem("Favorite Quotes:", profile.profile_data.interests.favoriteQuotes)}
        </Box>

        {/* Contact Section */}
        <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <Typography variant="h6" className="font-bold mb-3">Contact</Typography>
          <Box className="space-y-2">
            {profile.profile_data.contact && (
              <>
                {renderInterestItem(<EmailIcon fontSize="small" sx={{ color: '#EA4335', marginRight: '8px' }} />, profile.profile_data.contact.email)}
                <Box my={1} />
                {renderInterestItem(<PhoneIcon fontSize="small" sx={{ color: '#34A853', marginRight: '8px' }} />, profile.profile_data.contact.phone)}
                <Box my={1} />
                {renderInterestItem(<FacebookIcon fontSize="small" sx={{ color: '#1877F2', marginRight: '8px' }} />, profile.profile_data.contact.facebook)}
                <Box my={1} />
                {renderInterestItem(<InstagramIcon fontSize="small" sx={{ color: '#E4405F', marginRight: '8px' }} />, profile.profile_data.contact.instagram)}
                <Box my={1} />
                {renderInterestItem(<TwitterIcon fontSize="small" sx={{ color: '#1DA1F2', marginRight: '8px' }} />, profile.profile_data.contact.twitter)}
                <Box my={1} />
                {renderInterestItem(<LinkedInIcon fontSize="small" sx={{ color: '#0A66C2', marginRight: '8px' }} />, profile.profile_data.contact.linkedin)}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileCard;
